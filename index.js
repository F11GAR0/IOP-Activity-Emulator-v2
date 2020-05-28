const fs = require("fs");
const request = require('request');

function get_settings(){
    let fdata = fs.readFileSync("settings.ini", "utf8");
    var lines = fdata.split('\n');
    var ret = [[]];
    ret.shift();
    for(var i = 0; i < lines.length; i++){
        var splitted = lines[i].replace(' ', '').replace(' ', '').split('=');
        if(splitted.length == 2){
            ret.push(splitted);    
        }
    }
    return ret;
}

function get_from_settings(settings_data, key){
    for(var i = 0; i < settings_data.length; i++){
        if(settings_data[i][0] == key){
            return settings_data[i][1];        
        }    
    }
    return null;
}

function main(){
    var settings = get_settings();
    var login = get_from_settings(settings, 'login');
    var password = get_from_settings(settings, 'password');
    var req = {
            url: 'https://www.mivlgu.ru/iop/login/index.php',
            headers: {
                'Referer': 'https://www.mivlgu.ru/iop/login/index.php'            
            },
            formData: {
                username: login,
                password: password
            }
        }
    console.log(req);
    request.post(req, (error, response, body) => {
        if (error) {
            console.error(`Could not send request: ${error.message}`);
            return;
        }

        if(response.statusCode == 303){
            request.get({
                            url: 'https://www.mivlgu.ru/iop/login/index.php?testsession=8083'
                        }, (error, response, body) => {
                            console.log('Succesfuly logined');
                        });                        
        }
        else
        {        
                if (response.statusCode != 200) {
                    console.error(`Expected status code 200 but received ${response.statusCode}.`);
                    return;
                }

                console.log('Processing our list of movies');
                console.log(body);
        }
        }
    );
}

main();
