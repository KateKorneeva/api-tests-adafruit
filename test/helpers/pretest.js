import test from 'ava';
import {
    getApi,
    auth,
    deleteFeed,
    responseErrMessage as err
} from './shortcuts';

test.before('Delete all feeds', async t => {
    // Authorise
    t.context.api = await getApi();
    auth(t.context.api);

    // Delete all existing feeds
    const respFeeds = await t.context.api.get('/feeds');
    t.is(respFeeds.status, 200, err(respFeeds));
    const feeds = respFeeds.data;
    let feedKey;
    for (let i in feeds) {
        feedKey = feeds[i].key;
        await deleteFeed(t, t.context.api, feedKey);
    }
});

test('Pretest script finished', async t => {
    t.pass();
});