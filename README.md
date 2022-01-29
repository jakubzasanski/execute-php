execute-php
========

Execute PHP function within NodeJS application

Fork of [exec-php](https://github.com/iqbalfn/exec-php) with support ES6 modules and node 16+.

`After exec-php bring support nodeJS 16+ this package will be depracted.`

Install
-------

    $ npm install execute-php

Usage
-----

    import executePhp from "execute-php";

    executePhp('path/to/php/file.php', '/path/to/php/bin/php', function(error, php, output){

        // php now contain user defined php functions.
        php.my_own_php_function(arg1, arg2, function(error, result, output, printed){
            // `result` is return value of `my_own_php_function` php function.
        });
    });

execute-php arguments
------------------

1. `String`. Path to user php file.
2. `String`. Path to machine php bin file.
3. `Function`. Callback function after creating `execute-php` object. This function will get called with below arguments :

The `Function` arguments called with this arguments:

1. `Mixed`. Error message.
2. `Object`. Execute-php object that contain all user php defined function.
3. `String`. Printed string when requiring user php file.

execute-php object
---------------

All user function defined on user php file will be appended to execute-php object.
Call it normally with the last argument is callback function. The callback 
function called with below arguments :

1. `Mixed`. Error message.
2. `Mixed`. Returned value of user php function.
3. `String`. Printed string of php file when requiring it.
4. `String`. Printed string of php function when calling it.


Note
----

All uppercase function name on PHP will be converted to lowercase on `execute-php`.

    // file.php
    <?php
    
        function MyFunction($a, $b){ return $a + $b; }
    
    // app.js 
    import executePhp from "execute-php";

    executePhp('file.php', function(error, php, outprint){
        php.myfunction(1, 2, function(error, result){
            // result is now 3
        });
    });
