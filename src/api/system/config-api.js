import { getRequest, postRequest } from '/src/lib/axios';

export const configApi = {

    saveConfigList :(params)=> {
        return postRequest( `/config/saveList`,params)
    },

    getConfigList: params => {
        return getRequest( 'config/getConfigList', params)
    },

    getVersion: params =>{
        return getRequest( 'version', params)
    }
}