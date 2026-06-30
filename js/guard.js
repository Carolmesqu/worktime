import {

    checkLogin

} from "./auth.js";

checkLogin((user)=>{

    if(!user){

        window.location.href = "index.html";

    }

});