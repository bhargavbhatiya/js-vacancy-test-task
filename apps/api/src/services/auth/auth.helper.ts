import psl from 'psl';
import url from 'url';

import { AppKoaContext } from 'types';
import { COOKIES } from 'app-constants';

import config from 'config';

export const setTokenCookies = ({
  ctx,
  accessToken,
}: {
  ctx: AppKoaContext;
  accessToken: string;
}) => {
  const parsedUrl = url.parse(config.WEB_URL);

  if (!parsedUrl.hostname) {
    return;
  }
  const parsed = psl.parse(parsedUrl.hostname) as psl.ParsedDomain;
  /* Browser will not allow to set cookies for the domain that is not a subdomain of the current domain. so instead of setting cookies for the whole domain, we set it for the current subdomain only. */

  // const cookiesDomain = parsed.domain || undefined;
  const cookiesDomain = parsed.tld || undefined;

  // console.log("parsedUrl.hostname", parsedUrl.hostname); parsedUrl.hostname js-vacancy-test-task-web-sg3f.onrender.com
  // console.log("parsed", parsed);
  //  Output: parsed {
  //    input: 'js-vacancy-test-task-web-sg3f.onrender.com',
  //    tld: 'onrender.com',
  //    sld: 'js-vacancy-test-task-web-sg3f',
  //    domain: 'js-vacancy-test-task-web-sg3f.onrender.com',
  //    subdomain: null,
  //    listed: true
  //  }
  ctx.cookies.set(COOKIES.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    domain: '.onrender.com',
    expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
  });
};

export const unsetTokenCookies = (ctx: AppKoaContext) => {
  ctx.cookies.set(COOKIES.ACCESS_TOKEN);
};

export default {
  setTokenCookies,
  unsetTokenCookies,
};
