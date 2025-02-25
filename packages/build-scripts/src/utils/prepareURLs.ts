/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file at
 * https://github.com/facebookincubator/create-react-app/blob/master/LICENSE
 */

import chalk from 'chalk';

import url = require('url');
import address = require('address');

interface IPrepareUrls {
  lanUrlForConfig: any;
  lanUrlForTerminal: string;
  lanUrlForBrowser: string;
  localUrlForTerminal: string;
  localUrlForBrowser: string;
}

export = function prepareUrls(
  protocol: string,
  host: string,
  port: number,
  pathname = '/',
): IPrepareUrls {
  const formatUrl = (hostname: string): string =>
    url.format({
      protocol,
      hostname,
      port,
      pathname,
    });
  const prettyPrintUrl = (hostname: string): string =>
    url.format({
      protocol,
      hostname,
      port: chalk.bold(port.toString()),
      pathname,
    });

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
  let prettyHost;
  let lanUrlForConfig;
  let lanUrlForTerminal;
  let lanUrlForBrowser;
  if (isUnspecifiedHost) {
    prettyHost = 'localhost';
    try {
      // This can only return an IPv4 address
      lanUrlForConfig = address.ip();
      if (lanUrlForConfig) {
        // Check if the address is a private ip
        // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
        if (
          /^10[.]|^30[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(
            lanUrlForConfig,
          ) ||
          process.env.USE_PUBLIC_IP
        ) {
          // Address is private, format it for later use
          lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
          lanUrlForBrowser = formatUrl(lanUrlForConfig);
        } else {
          // Address is not private, so we will discard it
          lanUrlForConfig = undefined;
        }
      }
    } catch (_e) {
      // ignored
    }
  } else {
    prettyHost = host;
  }
  const localUrlForTerminal = prettyPrintUrl(prettyHost);
  const localUrlForBrowser = formatUrl(prettyHost);
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    lanUrlForBrowser,
    localUrlForTerminal,
    localUrlForBrowser,
  };
};
