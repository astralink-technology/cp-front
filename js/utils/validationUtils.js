/* Utilities to be used with require js */
define('utils/validationUtils', ['jquery'], function ($)  {

    var validateRequired = function(variable, feedback, customMessage, alert){
        if (!variable){
            var message = "Required";
            if (customMessage){
                message = customMessage;
            }
            if (alert){
                alert(message);
            }else{
                $("#" + feedback).html(message);
                $("#" + feedback).show();
            }
            return false;
        }else{
            $("#" + feedback).hide();
            return true;
        }
    }

    var validateMatch = function (variable1, variable2, feedback, customMessage, alert, required, requiredCustomMessage){
        var requiredMessage = "Required";
        var doesNotMatchMessage = "Does not match";
        if (required && !variable1){
            if (requiredCustomMessage){
                requiredMessage = requiredCustomMessage;
            }
            if (alert){
                alert(requiredMessage);
            }else{
                $("#" + feedback).html(requiredMessage);
                $("#" + feedback).show();
            }
            return false;
        }else{
            //check if both variables match
            if (variable1 != variable2){
                if (customMessage){
                    doesNotMatchMessage = customMessage;
                }
                if (alert){
                    alert(doesNotMatchMessage);
                }else{
                    $("#" + feedback).html(doesNotMatchMessage);
                    $("#" + feedback).show();
                }
                return false;
            }else{
                $("#" + feedback).hide();
                return true;
            }
        }
    }

    var validateEmail = function(variable, feedback, customMessage, alert, required, requiredCustomMessage){
        var requiredMessage = "Required";
        var emailFormatMessage = "Invalid Email";
        var checkEmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (required && !variable){
            if (requiredCustomMessage){
                requiredMessage = requiredCustomMessage;
            }
            if (alert){
                alert(requiredMessage);
            }else{
                $("#" + feedback).html(requiredMessage);
                $("#" + feedback).show();
            }
            return false;
        }else{
            //check the email format
            if (!checkEmailRegex.test(variable)){
                if (customMessage){
                    emailFormatMessage = customMessage;
                }
                if (alert){
                    alert(emailFormatMessage);
                }else{
                    $("#" + feedback).html(emailFormatMessage);
                    $("#" + feedback).show();
                }
                return false;
            }else{
                $("#" + feedback).hide();
                return true;
            }
        }
    }

    return {
        validateRequired: validateRequired,
        validateMatch: validateMatch,
        validateEmail: validateEmail
    };


});