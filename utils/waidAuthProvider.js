const appConfig = require('../app.config')
const { machineIdSync } = require('node-machine-id')
const { nanoid } = require('nanoid')
const axios = require('axios')
const keytar = require('keytar')
const os = require('os')

class AuthProvider {
    authCodeUrlParams;
    authCodeRequest;
    authRefreshRequest;
    accessToken;
    accessTokenExpireDate;
    keytarService = 'waid-oauth';
    keytarAccount = os.userInfo().username;

    constructor () {
      const clientId = appConfig.waidClientId
      const requestScopes = appConfig.waidRequestScopes
      const redirectUri = 'atom://callback'
      const deviceId = machineIdSync()

      this.accessToken = null
      this.accessTokenExpireDate = null

      this.authCodeUrlParams = {
        response_type: 'code',
        scope: requestScopes,
        redirect_uri: redirectUri,
        client_id: clientId,
        device_id: deviceId
      }

      this.authCodeRequest = {
        grant_type: 'authorization_code',
        scope: requestScopes,
        redirect_uri: redirectUri,
        client_id: clientId,
        device_id: deviceId
      }

      this.authRefreshRequest = {
        grant_type: 'refresh_token',
        client_id: clientId,
        device_id: deviceId
      }
    }

    async login (authWindow) {
      const state = nanoid()
      const challenge = nanoid(43)
      const authCodeUrlParamsCustom = {
        ...this.authCodeUrlParams,
        state: state,
        code_challenge: challenge,
        code_challenge_method: 'plain'
      }
      const authCodeUrl = 'https://www.webasyst.com/id/oauth2/auth/code?' + (new URLSearchParams(authCodeUrlParamsCustom).toString())

      try {
        const authCode = await this.listenForAuthCode(authCodeUrl, authWindow)
        const response = await this.acquireTokenByCode({
          ...this.authCodeRequest,
          code: authCode,
          code_verifier: challenge
        })
        this.handleResponse(response)
      } catch (e) {
        await this.logout()
        throw e
      }
    }

    async logout () {
      await keytar.deletePassword(this.keytarService, this.keytarAccount)
      this.accessToken = null
      this.accessTokenExpireDate = null
    }

    async getToken () {
      if ((this.accessTokenExpireDate - new Date().getTime()) < 60000) {
        try {
          await this.acquireTokenByRefresh()
        } catch (e) {}
      }
      return this.accessToken
    }

    async acquireTokenByRefresh () {
      const refreshToken = await keytar.getPassword(this.keytarService, this.keytarAccount)
      if (refreshToken) {
        const params = {
          ...this.authRefreshRequest,
          refresh_token: refreshToken
        }
        try {
          const response = await this.acquireTokenByCode(params)
          this.handleResponse(response)
        } catch (e) {
          await this.logout()
          throw e
        }
      } else {
        throw new Error('No available refresh token.')
      }
    }

    acquireTokenByCode (authRequest) {
      const options = new URLSearchParams(authRequest).toString()
      return axios.post('https://www.webasyst.com/id/oauth2/auth/token', options)
    }

    listenForAuthCode (navigateUrl, authWindow) {
      authWindow.loadURL(navigateUrl)

      return new Promise((resolve, reject) => {
        authWindow.webContents.on('will-redirect', (event, responseUrl) => {
          try {
            const parsedUrl = new URL(responseUrl)
            const authCode = parsedUrl.searchParams.get('code')
            resolve(authCode)
          } catch (e) {
            reject(e)
          }
        })
      })
    }

    handleResponse (response) {
      this.accessToken = response.data.access_token
      this.accessTokenExpireDate = new Date().getTime() + response.data.expires_in * 1000

      const refreshToken = response.data.refresh_token
      if (refreshToken) {
        keytar.setPassword(this.keytarService, this.keytarAccount, refreshToken)
      }
    }
}

module.exports = {
  AuthProvider
}
