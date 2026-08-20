"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envlocal = __dirname + '/../../../.env.local';
require('dotenv').config({ quiet: true, path: [envlocal] });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, node_test_1.describe)('PageDirect', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when NOTION_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('NOTION_TEST_LIVE'));
    (0, node_test_1.test)('direct-exists', async () => {
        const sdk = new __1.NotionSDK({
            // Concrete base: a live construction must satisfy any server
            // variables a templated base URL declares; overriding base with a
            // literal (as the direct flow tests do) sidesteps the requirement.
            base: 'http://localhost:8080',
            system: { fetch: async () => ({}) }
        });
        (0, node_assert_1.default)('function' === typeof sdk.direct);
        (0, node_assert_1.default)('function' === typeof sdk.prepare);
    });
    (0, node_test_1.test)('direct-load-page', async (t) => {
        const setup = directSetup({ id: 'direct01' });
        if ((0, utility_1.maybeSkipControl)(t, 'direct', 'direct-load-page', setup.live))
            return;
        if ((0, utility_1.skipIfMissingIds)(t, setup, ["id01"]))
            return;
        const { client, calls } = setup;
        const params = {};
        const query = {};
        if (setup.live) {
        }
        else {
            params.id = 'direct01';
        }
        const result = await client.direct({
            path: 'pages/{id}',
            method: 'GET',
            params,
            query,
        });
        if (setup.live) {
            // Live mode is lenient: synthetic IDs frequently 4xx. Skip rather
            // than fail when the load endpoint isn't reachable with the IDs we
            // can construct from setup.idmap.
            if (!result.ok || result.status < 200 || result.status >= 300) {
                return;
            }
        }
        else {
            (0, node_assert_1.default)(result.ok === true);
            (0, node_assert_1.default)(result.status === 200);
            (0, node_assert_1.default)(null != result.data);
            (0, node_assert_1.default)(result.data.id === 'direct01');
            (0, node_assert_1.default)(calls.length === 1);
            (0, node_assert_1.default)(calls[0].init.method === 'GET');
            (0, node_assert_1.default)(calls[0].url.includes('direct01'));
        }
    });
});
function directSetup(mockres) {
    const calls = [];
    const env = (0, utility_1.envOverride)({
        'NOTION_TEST_PAGE_ENTID': {},
        'NOTION_TEST_LIVE': 'FALSE',
        'NOTION_APIKEY': 'NONE',
    });
    const live = 'TRUE' === env.NOTION_TEST_LIVE;
    if (live) {
        const client = new __1.NotionSDK({
            apikey: env.NOTION_APIKEY,
        });
        let idmap = env['NOTION_TEST_PAGE_ENTID'];
        if ('string' === typeof idmap && idmap.startsWith('{')) {
            idmap = JSON.parse(idmap);
        }
        return { client, calls, live, idmap };
    }
    const mockFetch = async (url, init) => {
        calls.push({ url, init });
        return {
            status: 200,
            statusText: 'OK',
            headers: {},
            json: async () => (null != mockres ? mockres : { id: 'direct01' }),
        };
    };
    const client = new __1.NotionSDK({
        base: 'http://localhost:8080',
        system: { fetch: mockFetch },
    });
    return { client, calls, live, idmap: {} };
}
// direct() returns the raw response body. List endpoints often wrap the
// array in an envelope (e.g. { data: [...] }, { entities: [...] },
// { pagination, data: [...] }). The test transforms the raw body to
// extract the first array — either the body itself or the first array
// property of an envelope object.
function unwrapListData(data) {
    if (Array.isArray(data))
        return data;
    if (data && 'object' === typeof data) {
        for (const v of Object.values(data)) {
            if (Array.isArray(v))
                return v;
        }
    }
    return null;
}
//# sourceMappingURL=PageDirect.test.js.map