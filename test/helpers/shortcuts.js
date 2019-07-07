import axios from 'axios';
import tv4 from 'tv4';
import {
    BASE_URL as url,
    ADAFRUIT_IO_KEY as ioKey,
    ADAFRUIT_IO_USERNAME as user,
    feedObject as feedFixtureObj
} from './fixtures';

export const getApi = async () => {
    const client = axios.create({
        baseURL: url + user,
        validateStatus() { return true; },
    });

    return client;
};

export const auth = api => {
    api.defaults.headers['X-AIO-Key'] = ioKey;
};

export const logout = api => {
    delete api.defaults.headers['X-AIO-Key'];
};

export const responseErrMessage = response => {
    return JSON.stringify(response.data, null, 2)
};

export const createFeed = async (t, api, feedObject = feedFixtureObj ) => {
    const resp  = await api.post('/feeds', feedObject);
    t.is(resp.status, 201, responseErrMessage(resp));

    return resp.data
};

export const deleteFeed = async (t, api, feedKey ) => {
    const resp  = await api.delete(`/feeds/${feedKey}`);
    t.is(resp.status, 200, responseErrMessage(resp));

    return resp.data
};

export const validateBySchema = (t, data, schema) => {
    if (!tv4.validate(data, schema)) { // if simple schema validation returns false
        const errors = tv4.validateMultiple(data, schema).errors;
        errors.forEach(error => {
            const objectWithErr = getObjectContainingValue(data, error.dataPath);
            const failMessage = 'Schema validation error:\n' + error.message
            + '\n dataPath:   ' + error.dataPath
            + '\n Object with error:' + objectWithErr;

            t.fail(failMessage);
        });
    }
};

const getObjectContainingValue = (data, dataPath) => {
    let pathArr = dataPath.split('/');
    let val = data;
    
    pathArr.pop(); // remove the last element of the path because we want to see bigger picture

    if (pathArr[0] === '') { pathArr.shift() } // remove empty string which may happen to be the first element

    for (let i in pathArr) {
        if (isNaN(parseInt(pathArr[i]))) { // if element is not an int
            val = val[pathArr[i]];
        }
        else if (!isNaN(parseInt(pathArr[i]))) { // if element is an int
            val = val[parseInt(pathArr[i])];
        }
    }

    return JSON.stringify(val, null, 2); // pretty JSON output
}