 // const URL = 'http://localhost:9080/api';
const URL = 'http://192.168.1.82:9080/api';
const URL_WORDOOR = 'http://192.168.1.82:9080/';
 const STATIC = false;

 let API_URL = {

 };

 if (!STATIC) {
     API_URL = {
         domain: `${URL_WORDOOR}`,
         upload:`${URL_WORDOOR}upload/`,
         www: `${URL_WORDOOR}`,
         category: {
             list: `${URL}/categories`,
             del: `${URL}/category/`,
             add: `${URL}/category`,
             update: `${URL}/category`,
         },
         template: {
             add: `${URL}/template`,
             update: `${URL}/template`,
             list: `${URL}/templates`,
             del: `${URL}/template/`,
             generate: `${URL}/template`,
             show: `${URL}/template/`,
         },
         course: {
             list: `${URL}/courses`,
             add: `${URL}/course`,
             update: `${URL}/course/`,
             del: `${URL}/course/`,
             export: `${URL}/course/export/`,
         },
          user: {
             list: `${URL}/users`,
             enable: `${URL}/user/enable/`,
             disable: `${URL}/user/disable/`,
             status: `${URL}/user/`,
             update: `${URL}/user`,
             reset: `${URL}/user/resetpassword`,

             /* front */
             login: `${URL}/user/login`,
             info: `${URL}/user/info`,
             updateInfo: `${URL}/user/info`,
             password: `${URL}/user/password`,
             register: `${URL}/user/venuemanager`,
         },
         image: {
             del: `${URL}/image/`,
             add: `${URL}/image/`,
             update: `${URL}/image`,
             show: `${URL}/image`,
             list: `${URL}/images`,
             status: `${URL}/image/`,
         },
         audio: {
             del: `${URL}/music/`,
             add: `${URL}/music`,
             update: `${URL}/music`,
             list: `${URL}/musics`,
             show: `${URL}/music`,
         },
     };
 }

 export { API_URL as default };
