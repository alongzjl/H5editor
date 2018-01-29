const URL = 'http://editor.gopopon.com/api';
const URL_WORDOOR = 'http://editor.gopopon.com/';
 //const URL = 'http://192.168.1.82:9080/api';
 //const URL_WORDOOR = 'http://192.168.1.82:9080/';
const STATIC = false; 
 
let API_URL = {  

}; 

if (!STATIC) {
    API_URL = {
         domain: `${URL_WORDOOR}`,
         upload:`${URL_WORDOOR}upload/`,
         wordoor:'http://sim.content.gopopon.com/',
        course: {
            save: `${URL}/course`,
            show: `${URL}/course/`,
            list: `${URL}/courses`
        },
        template: {  
            save: `${URL}/template`,
            list: `${URL}/templates`,
            listSearch: `${URL}/templates/listSearch`,
            show: `${URL}/template/`,
             del: `${URL}/template/`,
        },
        category: {
            list: `${URL}/categories`,
        },
        audio: {
            list: `${URL}/musics/all`,
            upload: `${URL}/upload/music`,
        },
        user: {
            login: `${URL}/user/login`,
        },
        image: {
            list: `${URL}/images`,
            upload: `${URL}/upload/image`,
            crop: `${URL}/image/crop`,
            del: `${URL}/image/`,
        },
    };
}

export { API_URL as default };
