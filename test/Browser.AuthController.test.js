const expect = chai.expect;

const utils = require('../src/utils.js');
const AuthController = require('../src/Auth/AuthController.js');
const testData = require('./test-data.js');

describe('Browser.LoginButton', () => {
  let auth;
  before(async () => {
    auth = new AuthController({
      authRequest: {
        requestingAppId: 'lib-js-test',
        requestedPermissions: []
      }
    }, testData.serviceInfoUrl, {});
    await auth.init();
  })
  it('getReturnURL()', async () => {
    const myUrl = 'https://mysite.com/bobby';
    let error = null;
    try {
      auth.getReturnURL('auto');
    } catch (e) {
      error = e;
    }
    expect(error).to.be.not.null;

    let fakeNavigator = { userAgent: 'android' };
    expect(auth.getReturnURL('auto#', myUrl, fakeNavigator)).to.equal(myUrl + '#');
    expect(auth.getReturnURL('auto?', myUrl, fakeNavigator)).to.equal(myUrl + '?');
    expect(auth.getReturnURL(false, myUrl, fakeNavigator)).to.equal(myUrl + '#');
    expect(auth.getReturnURL('self?', myUrl, fakeNavigator)).to.equal(myUrl + '?');

    expect(auth.getReturnURL('http://zou.zou/toto#', myUrl, fakeNavigator)).to.equal('http://zou.zou/toto#');

    fakeNavigator =  { userAgent: 'Safari' };
    expect(auth.getReturnURL('auto#', myUrl, fakeNavigator)).to.equal(false);
    expect(auth.getReturnURL('auto?', myUrl, fakeNavigator)).to.equal(false);
    expect(auth.getReturnURL(false, myUrl, fakeNavigator)).to.equal(false);
    expect(auth.getReturnURL('self?', myUrl, fakeNavigator)).to.equal(myUrl + '?');
    expect(auth.getReturnURL('http://zou.zou/toto#', myUrl, fakeNavigator)).to.equal('http://zou.zou/toto#');
    global.window = { location: { href: myUrl + '?prYvstatus=zouzou'} }
    expect(auth.getReturnURL('self?', myUrl, fakeNavigator)).to.equal(myUrl + '?');
  });

  it('browserIsMobileOrTablet()', async () => {
    expect(utils.browserIsMobileOrTablet({ userAgent: 'android' })).to.be.true;
    expect(utils.browserIsMobileOrTablet({ userAgent: 'Safari' })).to.be.false;
  });

  it('getServiceInfoFromURL()', async () => {
    const serviceInfoUrl = AuthController.getServiceInfoFromURL(
      'https://my.Url.com/?bobby=2&prYvZoutOu=1&pryvServiceInfoUrl=' + encodeURIComponent('https://reg.pryv.me/service/infos'));

    expect('https://reg.pryv.me/service/infos').to.equal(serviceInfoUrl);
  });


  it('cleanURLFromPrYvParams()', async () => {

    expect('https://my.Url.com/?bobby=2').to.equal(utils.cleanURLFromPrYvParams(
      'https://my.Url.com/?bobby=2&prYvZoutOu=1&prYvstatus=2jsadh'));

    expect('https://my.Url.com/?pryvServiceInfoUrl=zzz').to.equal(utils.cleanURLFromPrYvParams(
      'https://my.Url.com/?pryvServiceInfoUrl=zzz#prYvZoutOu=1&prYvstatus=2jsadh'));

    expect('https://my.Url.com/').to.equal(utils.cleanURLFromPrYvParams(
      'https://my.Url.com/?prYvstatus=2jsadh'));

    expect('https://my.Url.com/').to.equal(utils.cleanURLFromPrYvParams(
      'https://my.Url.com/#prYvstatus=2jsadh'));

    expect('https://my.Url.com/#bobby=2').to.equal(utils.cleanURLFromPrYvParams(
      'https://my.Url.com/#bobby=2&prYvZoutOu=1&prYvstatus=2jsadh'));
    
  });

});


