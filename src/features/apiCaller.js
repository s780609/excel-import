/**
 * 呼叫內網API使用
 * @param {object} options {
 *   requestUrl: `${webApiConnectorUrl}/cmd/quote/copyquote`,
 *   requestMethod: "POST",
 *   requestBody: { QuoteId: selectedQuotedId, LoginUserId: loginUserId },
 *   queryString: ""
 * };
 * @returns {object} callApiResponse {
 * (bool) isSuccess
 * (object) response
 * (string) errorMessage
 * (object) errorDetails
 * };
 * @author ArcherHsu
 */
const crmWebApi = (options) => {
  return new Promise((resolve, reject) => {
    // check is param valid
    if (!options.requestUrl) {
      reject("no requestUrl");
    }
    if (!options.requestMethod) {
      reject("no requestMethod");
    }

    const xhr = new XMLHttpRequest();
    let isvUrl = `https://${window.location.hostname}/ISV/CrmWebApi/CrmWebApi.ashx`;

    if (options.queryString) {
      isvUrl += `?${options.queryString}`;
    }

    const body = {
      requestUrl: options.requestUrl,
      requestMethod: options.requestMethod,
    };

    if (options.requestBody) {
      body.requestBody = JSON.stringify(options.requestBody);
    }

    xhr.open("POST", isvUrl);
    xhr.withCredentials = false;
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.onload = () => {
      const callApiResponse = JSON.parse(xhr.response);
      if (callApiResponse.isSuccess !== true) {
        debugger;
        reject(callApiResponse);
      } else {
        resolve(callApiResponse);
      }
    };

    xhr.onerror = () => reject(new Error(xhr.statusText));
    xhr.send(JSON.stringify(body));
  });
};

const getAppSetting = (appSettingKeyName, isLocal = false) => {
  if (isLocal == true) {
    return new Promise((resolve, reject) => {
      resolve("https://luxtest.luxshare-ict.com:8080");
    });
  }

  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open(
      "GET",
      `/api/data/v9.0/lux_appsettings?$filter=lux_name eq '${appSettingKeyName}'`,
      true
    );
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
      if (this.readyState === 4) {
        req.onreadystatechange = null;
        if (this.status === 204 || this.status === 200) {
          const response = JSON.parse(this.responseText);
          if (response.value.length > 0) {
            const appSettingValue = response.value[0].lux_value;

            if (appSettingValue === null || appSettingValue === "") {
              debugger;
              alert(
                `value of Key:${appSettingKeyName} in lux_appsettings is empty.`
              );
              reject(
                `value of Key:${appSettingKeyName} in lux_appsettings is empty.`
              );
            }

            resolve(appSettingValue);
          } else {
            debugger;
            alert(`Key:${appSettingKeyName} not found in lux_appsettings.`);
            reject(`Key:${appSettingKeyName} not found in lux_appsettings.`);
          }
        } else {
          debugger;
          console.log("Error");
          console.log(this);
          reject(`Key:${appSettingKeyName} not found in lux_appsettings.`);
        }
      }
    };
    req.send();
  });
};

var lux = {};

lux.crmWebApi = crmWebApi;
lux.getAppSetting = getAppSetting;

export default lux;
