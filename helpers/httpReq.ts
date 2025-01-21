/**
 * Used to make HTTP requests
 */

/**
 * Return interfaces for HTTP helper methods below
 */

export interface ApiData {
  ok: boolean
  msg: string
  status: number
  data: Array<unknown> | null
}

/**
 * Headers interface
 */

interface Headers {
  ['Content-Type']: string
  [key: string]: string // Allow additional headers
}

/**
 * RequestOptions interface
 */

interface RequestOptions extends RequestInit {
  body?: string | null // Override to allow nullable body
}

export default class HttpReq {
  /**
   * PROPERTY
   *
   * Set default timeout in HTTP requests
   */
  static #defaultTimeout = 10000

  /**
   * METHOD
   *
   * Makes get request using the #makeRequest method
   *
   * @param url - string - Url to make request to
   * @param headers - object - Additional header data.
   * @param timeOut - number - Number of seconds to wait for response before timing out.  If parameter passed, default timeout is set.
   *
   * @return Promise<ApiData>
   */

  static async get(
    url: string = '',
    headers: Headers = {
      'Content-Type': '',
    },
    timeOut: number = HttpReq.#defaultTimeout,
  ): Promise<ApiData> {
    return HttpReq.#makeRequest('GET', url, null, headers, timeOut)
  }

  /**
   * METHOD
   *
   * Makes post request using the #makeRequest method
   *
   * @param url - string - Url to make request to
   * @param data - any - Data for post request
   * @param headers - object - Additional header data.
   * @param timeOut - number - Number of seconds to wait for response before timing out.  If parameter passed, default timeout is set.
   *
   * @return Promise<ApiData>
   */

  static async post(
    url: string = '',
    data = null,
    headers: Headers = {
      'Content-Type': '',
    },
    timeOut: number = HttpReq.#defaultTimeout,
  ): Promise<ApiData> {
    return HttpReq.#makeRequest('POST', url, data, headers, timeOut)
  }

  /**
   * METHOD
   *
   * Makes put request using the #makeRequest method
   *
   * @param url - string - Url to make request to
   * @param data - any - Data for put request
   * @param headers - object - Additional header data.
   * @param timeOut - number - Number of seconds to wait for response before timing out.  If parameter passed, default timeout is set.
   *
   * @return Promise<ApiData>
   */

  static async put(
    url: string = '',
    data = null,
    headers: Headers = {
      'Content-Type': '',
    },
    timeOut: number = HttpReq.#defaultTimeout,
  ): Promise<ApiData> {
    return HttpReq.#makeRequest('PUT', url, data, headers, timeOut)
  }

  /**
   * METHOD
   *
   * Makes delete request using the #makeRequest method
   *
   * @param url - string - Url to make request to
   * @param headers - object - Additional header data.
   * @param timeOut - number - Number of seconds to wait for response before timing out.  If parameter passed, default timeout is set.
   *
   * @return Promise<ApiData>
   */

  static async delete(
    url: string = '',
    headers: Headers = {
      'Content-Type': '',
    },
    timeOut: number = HttpReq.#defaultTimeout,
  ): Promise<ApiData> {
    return HttpReq.#makeRequest('DELETE', url, null, headers, timeOut)
  }

  /**
   * METHOD
   *
   * Makes http delete requests. Sets a timeout default to 10000ms to prevent indefinite wait.
   *
   * @param method - string - Http request method.  Can be 'GET', 'POST', 'PUT', or 'DELETE'.
   * @param url - string - URl for request.  Null by default.  Error thrown if null.
   * @param data - any - Data used for POST or PUT request methods.
   * @param headers - object - Additional header data.
   * @param timeOut - number - Optional parameter for timeout in milliseconds.  If parameter no passed in, 10000ms is defaulted.
   *
   * @return Promise<ApiData>
   */

  static async #makeRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data: null,
    headers: Headers = {
      'Content-Type': '',
    },
    timeOut: number,
  ): Promise<ApiData> {
    // Makes sure that timeOut parameter is not less than 1 second

    timeOut = Number(timeOut)

    if (!timeOut || Number(timeOut) < 1000) {
      return {
        ok: false,
        msg: 'Timeout cannot be less than 1000ms or 1 second.',
        status: 0,
        data: null,
      }
    }

    // Make sure header data is valid

    if (typeof headers !== 'object') {
      return { ok: false, msg: 'Invalid header data.', status: 0, data: null }
    }

    // Check that url is not null

    if (!url) {
      return { ok: false, msg: 'Invalid or missing URL.', status: 0, data: null }
    }

    // Timeout

    const timeout = new Promise<ApiData>((res) => {
      setTimeout(() => {
        res({
          ok: false,
          msg: `Fetch request at '${url}' took too long to respond.`,
          status: 0,
          data: [],
        })
      }, timeOut)
    })

    // Data fetch

    const fetchData = async (): Promise<ApiData> => {
      let headerData = {
        'Content-Type':
          headers['Content-Type'] !== '' ? headers['Content-Type'] : 'application/json',
      }
      if (headers) {
        headerData = { ...headerData, ...headers }
      }
      const requestOptions: RequestOptions = {
        method,
        headers: headerData,
      }
      if (method === 'POST' || method === 'PUT') {
        requestOptions.body = JSON.stringify(data)
      }
      try {
        const res: Response = await fetch(url, requestOptions)
        if (!res.ok) {
          console.error(
            `Server responded with a status code of '${res.status}' when attempting to fetch '${url}'`,
          )
          return {
            ok: false,
            msg: `Server responded with a status code of '${res.status}' when attempting to fetch '${url}'`,
            status: res.status,
            data: [],
          }
        }
        return { ok: res.ok, msg: `Success`, status: res.status, data: await res.json() }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof TypeError
            ? `Network or CORS issue: ${err.message}`
            : `Unexpected error: ${err instanceof Error ? err.message : String(err)}`
        console.error(errorMessage)
        return { ok: false, msg: `Could not fetch data at '${url}'. ${err}`, status: 0, data: [] }
      }
    }

    return Promise.race([timeout, fetchData()])
  }
}
