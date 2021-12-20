/**
 * Execute user php function.
 * @package exec-php
 * @version 0.0.6
 */

import { exec } from "child_process";
import tmp from "tmp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const dirPath = path.dirname(fileURLToPath(import.meta.url));

/**
 * Execute the script and get the result.
 * @param {string} file, User php file.
 * @param {string} bin, Path to php bin file.
 * @param {string} func, User php function name to call.
 * @param {array} args, List of function array, with the last arg is callback function.
 */
export default function execute(file, bin, func, args){
    if(!args || !args.length){
        args = [function(){}];
    }

    if(typeof args[args.length-1] !== 'function'){
        args.push(function(){});
    }

    let user_fn_args = args.slice(0, -1);
    let user_fn_cb = args[args.length-1];

    tmp.file(function(error, tmpParam, fd){
        var tmpParamData = {
            'arguments': user_fn_args,
            'file': file,
            'function': func
        };

        tmpParamData = JSON.stringify(tmpParamData);

        fs.writeFileSync(tmpParam, tmpParamData);

        tmp.file(function(error, tmpResult, fds){

            if (process.platform == "win32") {
                let cli = '"' + path.join(dirPath, 'php', 'cli.php') + '"',
                    cmd = [bin, cli, '-p' + '"' + tmpParam + '"', '-r' + '"' + tmpResult + '"'].join(' ');
            }
            else {
                let cli = path.join(dirPath, 'php', 'cli.php'),
                    cmd = [bin, cli.replace(" ", "\\ "), '-p' + tmpParam.replace(" ", "\\ "), '-r' + tmpResult.replace(" ", "\\ ")].join(' ');
            }

            let opt = {cwd: path.dirname(file)};

            exec(cmd, opt, function(error, stdout, stderr){
                if(error || stderr){
                    return user_fn_cb((error||stderr));
                }

                let data = JSON.parse(fs.readFileSync(tmpResult));

                fs.close(fd, function(){
                    fs.unlinkSync(tmpParam);
                });

                fs.close(fds, function(){
                    fs.unlinkSync(tmpResult);
                });

                user_fn_cb(false, data.result, data.output, data.printed);
            });
        });
    });
}
