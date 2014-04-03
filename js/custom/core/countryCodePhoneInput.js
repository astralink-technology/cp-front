define("core/countryCodePhoneInput", ['kendo'], function (kendo) {
    var _settings = null;
    var _countryData = [ {
        name: "Afghanistan",
        cca2: "AF",
        code: "93"
    },
        {
            name: "Albania",
            cca2: "AL",
            code: "355"
        }, {
            name: "Algeria",
            cca2: "DZ",
            code: "213"
        }, {
            name: "American Samoa",
            cca2: "AS",
            code: "1684"
        }, {
            name: "Andorra",
            cca2: "AD",
            code: "376"
        }, {
            name: "Angola",
            cca2: "AO",
            code: "244"
        }, {
            name: "Anguilla",
            cca2: "AI",
            code: "1264"
        }, {
            name: "Antigua and Barbuda",
            cca2: "AG",
            code: "1268"
        }, {
            name: "Argentina",
            cca2: "AR",
            code: "54"
        }, {
            name: "Armenia",
            cca2: "AM",
            code: "374"
        }, {
            name: "Aruba",
            cca2: "AW",
            code: "297"
        }, {
            name: "Australia",
            cca2: "AU",
            code: "61"
        }, {
            name: "Austria",
            cca2: "AT",
            code: "43"
        }, {
            name: "Azerbaijan",
            cca2: "AZ",
            code: "994"
        }, {
            name: "Bahamas",
            cca2: "BS",
            code: "1242"
        }, {
            name: "Bahrain",
            cca2: "BH",
            code: "973"
        }, {
            name: "Bangladesh",
            cca2: "BD",
            code: "880"
        }, {
            name: "Barbados",
            cca2: "BB",
            code: "1246"
        }, {
            name: "Belarus",
            cca2: "BY",
            code: "375"
        }, {
            name: "Belgium",
            cca2: "BE",
            code: "32"
        }, {
            name: "Belize",
            cca2: "BZ",
            code: "501"
        }, {
            name: "Benin",
            cca2: "BJ",
            code: "229"
        }, {
            name: "Bermuda",
            cca2: "BM",
            code: "1441"
        }, {
            name: "Bhutan",
            cca2: "BT",
            code: "975"
        }, {
            name: "Bolivia",
            cca2: "BO",
            code: "591"
        }, //{"name":"Bonaire","cca2":"BQ",code:"5997"},
        {
            name: "Bosnia and Herzegovina",
            cca2: "BA",
            code: "387"
        }, {
            name: "Botswana",
            cca2: "BW",
            code: "267"
        }, {
            name: "Brazil",
            cca2: "BR",
            code: "55"
        }, //{"name":"British Indian Ocean Territory","cca2":"IO",code:"246"},
        {
            name: "Brunei Darussalam",
            cca2: "BN",
            code: "673"
        }, {
            name: "Bulgaria",
            cca2: "BG",
            code: "359"
        }, {
            name: "Burkina Faso",
            cca2: "BF",
            code: "226"
        }, {
            name: "Burundi",
            cca2: "BI",
            code: "257"
        }, {
            name: "Cambodia",
            cca2: "KH",
            code: "855"
        }, {
            name: "Cameroon",
            cca2: "CM",
            code: "237"
        }, {
            name: "Canada",
            cca2: "CA",
            code: "1"
        }, {
            name: "Cape Verde",
            cca2: "CV",
            code: "238"
        }, {
            name: "Cayman Islands",
            cca2: "KY",
            code: "1345"
        }, {
            name: "Central African Republic",
            cca2: "CF",
            code: "236"
        }, {
            name: "Chad",
            cca2: "TD",
            code: "235"
        }, {
            name: "Chile",
            cca2: "CL",
            code: "56"
        }, {
            name: "China",
            cca2: "CN",
            code: "86"
        }, //{"name":"Christmas Island","cca2":"CX",code:"61"},
        //{"name":"Cocos (Keeling) Islands","cca2":"CC",code:"61"},
        {
            name: "Colombia",
            cca2: "CO",
            code: "57"
        }, {
            name: "Comoros",
            cca2: "KM",
            code: "269"
        }, {
            name: "Congo (DRC)",
            cca2: "CD",
            code: "243"
        }, {
            name: "Congo (Republic)",
            cca2: "CG",
            code: "242"
        }, {
            name: "Cook Islands",
            cca2: "CK",
            code: "682"
        }, {
            name: "Costa Rica",
            cca2: "CR",
            code: "506"
        }, {
            name: "Côte d'Ivoire",
            cca2: "CI",
            code: "225"
        }, {
            name: "Croatia",
            cca2: "HR",
            code: "385"
        }, {
            name: "Cuba",
            cca2: "CU",
            code: "53"
        }, //{"name":"Curaçao","cca2":"CW",code:"5999"},
        {
            name: "Cyprus",
            cca2: "CY",
            code: "357"
        }, {
            name: "Czech Republic",
            cca2: "CZ",
            code: "420"
        }, {
            name: "Denmark",
            cca2: "DK",
            code: "45"
        }, {
            name: "Djibouti",
            cca2: "DJ",
            code: "253"
        }, {
            name: "Dominica",
            cca2: "DM",
            code: "1767"
        }, {
            name: "Dominican Republic",
            cca2: "DO",
            code: "1809"
        }, {
            name: "Ecuador",
            cca2: "EC",
            code: "593"
        }, {
            name: "Egypt",
            cca2: "EG",
            code: "20"
        }, {
            name: "El Salvador",
            cca2: "SV",
            code: "503"
        }, {
            name: "Equatorial Guinea",
            cca2: "GQ",
            code: "240"
        }, {
            name: "Eritrea",
            cca2: "ER",
            code: "291"
        }, {
            name: "Estonia",
            cca2: "EE",
            code: "372"
        }, {
            name: "Ethiopia",
            cca2: "ET",
            code: "251"
        }, //{"name":"Falkland Islands (Malvinas)","cca2":"FK",code:"500"},
        {
            name: "Faroe Islands",
            cca2: "FO",
            code: "298"
        }, {
            name: "Fiji",
            cca2: "FJ",
            code: "679"
        }, {
            name: "Finland",
            cca2: "FI",
            code: "358"
        }, {
            name: "France",
            cca2: "FR",
            code: "33"
        }, //{"name":"French Guiana","cca2":"GF",code:"594"},
        {
            name: "French Polynesia",
            cca2: "PF",
            code: "689"
        }, {
            name: "Gabon",
            cca2: "GA",
            code: "241"
        }, {
            name: "Gambia",
            cca2: "GM",
            code: "220"
        }, {
            name: "Georgia",
            cca2: "GE",
            code: "995"
        }, {
            name: "Germany",
            cca2: "DE",
            code: "49"
        }, {
            name: "Ghana",
            cca2: "GH",
            code: "233"
        }, {
            name: "Gibraltar",
            cca2: "GI",
            code: "350"
        }, {
            name: "Greece",
            cca2: "GR",
            code: "30"
        }, {
            name: "Greenland",
            cca2: "GL",
            code: "299"
        }, {
            name: "Grenada",
            cca2: "GD",
            code: "1473"
        }, {
            name: "Guadeloupe",
            cca2: "GP",
            code: "590"
        }, {
            name: "Guam",
            cca2: "GU",
            code: "1671"
        }, {
            name: "Guatemala",
            cca2: "GT",
            code: "502"
        }, {
            name: "Guernsey",
            cca2: "GG",
            code: "44"
        }, {
            name: "Guinea",
            cca2: "GN",
            code: "224"
        }, {
            name: "Guinea-Bissau",
            cca2: "GW",
            code: "245"
        }, {
            name: "Guyana",
            cca2: "GY",
            code: "592"
        }, {
            name: "Haiti",
            cca2: "HT",
            code: "509"
        }, {
            name: "Honduras",
            cca2: "HN",
            code: "504"
        }, {
            name: "Hong Kong",
            cca2: "HK",
            code: "852"
        }, {
            name: "Hungary",
            cca2: "HU",
            code: "36"
        }, {
            name: "Iceland",
            cca2: "IS",
            code: "354"
        }, {
            name: "India",
            cca2: "IN",
            code: "91"
        }, {
            name: "Indonesia",
            cca2: "ID",
            code: "62"
        }, {
            name: "Iran",
            cca2: "IR",
            code: "98"
        }, {
            name: "Iraq",
            cca2: "IQ",
            code: "964"
        }, {
            name: "Ireland",
            cca2: "IE",
            code: "353"
        }, {
            name: "Isle of Man",
            cca2: "IM",
            code: "44"
        }, {
            name: "Israel",
            cca2: "IL",
            code: "972"
        }, {
            name: "Italy",
            cca2: "IT",
            code: "39"
        }, {
            name: "Jamaica",
            cca2: "JM",
            code: "1876"
        }, {
            name: "Japan",
            cca2: "JP",
            code: "81"
        }, {
            name: "Jersey",
            cca2: "JE",
            code: "44"
        }, {
            name: "Jordan",
            cca2: "JO",
            code: "962"
        }, {
            name: "Kazakhstan",
            cca2: "KZ",
            code: "7"
        }, {
            name: "Kenya",
            cca2: "KE",
            code: "254"
        }, {
            name: "Kiribati",
            cca2: "KI",
            code: "686"
        }, {
            name: "Kuwait",
            cca2: "KW",
            code: "965"
        }, {
            name: "Kyrgyzstan",
            cca2: "KG",
            code: "996"
        }, {
            name: "Laos",
            cca2: "LA",
            code: "856"
        }, {
            name: "Latvia",
            cca2: "LV",
            code: "371"
        }, {
            name: "Lebanon",
            cca2: "LB",
            code: "961"
        }, {
            name: "Lesotho",
            cca2: "LS",
            code: "266"
        }, {
            name: "Liberia",
            cca2: "LR",
            code: "231"
        }, {
            name: "Libya",
            cca2: "LY",
            code: "218"
        }, {
            name: "Liechtenstein",
            cca2: "LI",
            code: "423"
        }, {
            name: "Lithuania",
            cca2: "LT",
            code: "370"
        }, {
            name: "Luxembourg",
            cca2: "LU",
            code: "352"
        }, {
            name: "Macao",
            cca2: "MO",
            code: "853"
        }, {
            name: "Macedonia",
            cca2: "MK",
            code: "389"
        }, {
            name: "Madagascar",
            cca2: "MG",
            code: "261"
        }, {
            name: "Malawi",
            cca2: "MW",
            code: "265"
        }, {
            name: "Malaysia",
            cca2: "MY",
            code: "60"
        }, {
            name: "Maldives",
            cca2: "MV",
            code: "960"
        }, {
            name: "Mali",
            cca2: "ML",
            code: "223"
        }, {
            name: "Malta",
            cca2: "MT",
            code: "356"
        }, {
            name: "Marshall Islands",
            cca2: "MH",
            code: "692"
        }, {
            name: "Martinique",
            cca2: "MQ",
            code: "596"
        }, {
            name: "Mauritania",
            cca2: "MR",
            code: "222"
        }, {
            name: "Mauritius",
            cca2: "MU",
            code: "230"
        }, //{"name":"Mayotte","cca2":"YT",code:"262"},
        {
            name: "Mexico",
            cca2: "MX",
            code: "52"
        }, {
            name: "Micronesia",
            cca2: "FM",
            code: "691"
        }, {
            name: "Moldova",
            cca2: "MD",
            code: "373"
        }, {
            name: "Monaco",
            cca2: "MC",
            code: "377"
        }, {
            name: "Mongolia",
            cca2: "MN",
            code: "976"
        }, {
            name: "Montenegro",
            cca2: "ME",
            code: "382"
        }, {
            name: "Montserrat",
            cca2: "MS",
            code: "1664"
        }, {
            name: "Morocco",
            cca2: "MA",
            code: "212"
        }, {
            name: "Mozambique",
            cca2: "MZ",
            code: "258"
        }, {
            name: "Myanmar (Burma)",
            cca2: "MM",
            code: "95"
        }, {
            name: "Namibia",
            cca2: "NA",
            code: "264"
        }, {
            name: "Nauru",
            cca2: "NR",
            code: "674"
        }, {
            name: "Nepal",
            cca2: "NP",
            code: "977"
        }, {
            name: "Netherlands",
            cca2: "NL",
            code: "31"
        }, {
            name: "New Caledonia",
            cca2: "NC",
            code: "687"
        }, {
            name: "New Zealand",
            cca2: "NZ",
            code: "64"
        }, {
            name: "Nicaragua",
            cca2: "NI",
            code: "505"
        }, {
            name: "Niger",
            cca2: "NE",
            code: "227"
        }, {
            name: "Nigeria",
            cca2: "NG",
            code: "234"
        }, //{"name":"Niue","cca2":"NU",code:"683"},
        //{"name":"Norfolk Island","cca2":"NF",code:"672"},
        {
            name: "North Korea",
            cca2: "KP",
            code: "850"
        }, //{"name":"Northern Mariana Islands","cca2":"MP",code:"1670"},
        {
            name: "Norway",
            cca2: "NO",
            code: "47"
        }, {
            name: "Oman",
            cca2: "OM",
            code: "968"
        }, {
            name: "Pakistan",
            cca2: "PK",
            code: "92"
        }, {
            name: "Palau",
            cca2: "PW",
            code: "680"
        }, {
            name: "Palestinian Territory",
            cca2: "PS",
            code: "970"
        }, {
            name: "Panama",
            cca2: "PA",
            code: "507"
        }, {
            name: "Papua New Guinea",
            cca2: "PG",
            code: "675"
        }, {
            name: "Paraguay",
            cca2: "PY",
            code: "595"
        }, {
            name: "Peru",
            cca2: "PE",
            code: "51"
        }, {
            name: "Philippines",
            cca2: "PH",
            code: "63"
        }, //{"name":"Pitcairn","cca2":"PN",code:"64"},
        {
            name: "Poland",
            cca2: "PL",
            code: "48"
        }, {
            name: "Portugal",
            cca2: "PT",
            code: "351"
        }, {
            name: "Puerto Rico",
            cca2: "PR",
            code: "1787"
        }, {
            name: "Qatar",
            cca2: "QA",
            code: "974"
        }, {
            name: "Réunion",
            cca2: "RE",
            code: "262"
        }, {
            name: "Romania",
            cca2: "RO",
            code: "40"
        }, {
            name: "Russian Federation",
            cca2: "RU",
            code: "7"
        }, {
            name: "Rwanda",
            cca2: "RW",
            code: "250"
        }, //{"name":"Saint Barthélemy","cca2":"BL",code:"590"},
        //{"name":"Saint Helena","cca2":"SH",code:"290"},
        {
            name: "Saint Kitts and Nevis",
            cca2: "KN",
            code: "1869"
        }, {
            name: "Saint Lucia",
            cca2: "LC",
            code: "1758"
        }, //{"name":"Saint Martin","cca2":"MF",code:"590"},
        //{"name":"Saint Pierre and Miquelon","cca2":"PM",code:"508"},
        {
            name: "Saint Vincent and the Grenadines",
            cca2: "VC",
            code: "1784"
        }, {
            name: "Samoa",
            cca2: "WS",
            code: "685"
        }, {
            name: "San Marino",
            cca2: "SM",
            code: "378"
        }, {
            name: "São Tomé and Príncipe",
            cca2: "ST",
            code: "239"
        }, {
            name: "Saudi Arabia",
            cca2: "SA",
            code: "966"
        }, {
            name: "Senegal",
            cca2: "SN",
            code: "221"
        }, {
            name: "Serbia",
            cca2: "RS",
            code: "381"
        }, {
            name: "Seychelles",
            cca2: "SC",
            code: "248"
        }, {
            name: "Sierra Leone",
            cca2: "SL",
            code: "232"
        }, {
            name: "Singapore",
            cca2: "SG",
            code: "65"
        }, //{"name":"Sint Maarten","cca2":"SX",code:"1721"},
        {
            name: "Slovakia",
            cca2: "SK",
            code: "421"
        }, {
            name: "Slovenia",
            cca2: "SI",
            code: "386"
        }, {
            name: "Solomon Islands",
            cca2: "SB",
            code: "677"
        }, {
            name: "Somalia",
            cca2: "SO",
            code: "252"
        }, {
            name: "South Africa",
            cca2: "ZA",
            code: "27"
        }, //{"name":"South Georgia","cca2":"GS",code:"500"},
        {
            name: "South Korea",
            cca2: "KR",
            code: "82"
        }, //{"name":"South Sudan","cca2":"SS",code:"211"},
        {
            name: "Spain",
            cca2: "ES",
            code: "34"
        }, {
            name: "Sri Lanka",
            cca2: "LK",
            code: "94"
        }, {
            name: "Sudan",
            cca2: "SD",
            code: "249"
        }, {
            name: "Suriname",
            cca2: "SR",
            code: "597"
        }, //{"name":"Svalbard and Jan Mayen","cca2":"SJ",code:"4779"},
        {
            name: "Swaziland",
            cca2: "SZ",
            code: "268"
        }, {
            name: "Sweden",
            cca2: "SE",
            code: "46"
        }, {
            name: "Switzerland",
            cca2: "CH",
            code: "41"
        }, {
            name: "Syrian Arab Republic",
            cca2: "SY",
            code: "963"
        }, {
            name: "Taiwan, Province of China",
            cca2: "TW",
            code: "886"
        }, {
            name: "Tajikistan",
            cca2: "TJ",
            code: "992"
        }, {
            name: "Tanzania",
            cca2: "TZ",
            code: "255"
        }, {
            name: "Thailand",
            cca2: "TH",
            code: "66"
        }, {
            name: "Timor-Leste",
            cca2: "TL",
            code: "670"
        }, {
            name: "Togo",
            cca2: "TG",
            code: "228"
        }, //{"name":"Tokelau","cca2":"TK",code:"690"},
        {
            name: "Tonga",
            cca2: "TO",
            code: "676"
        }, {
            name: "Trinidad and Tobago",
            cca2: "TT",
            code: "1868"
        }, {
            name: "Tunisia",
            cca2: "TN",
            code: "216"
        }, {
            name: "Turkey",
            cca2: "TR",
            code: "90"
        }, {
            name: "Turkmenistan",
            cca2: "TM",
            code: "993"
        }, {
            name: "Turks and Caicos Islands",
            cca2: "TC",
            code: "1649"
        }, {
            name: "Tuvalu",
            cca2: "TV",
            code: "688"
        }, {
            name: "Uganda",
            cca2: "UG",
            code: "256"
        }, {
            name: "Ukraine",
            cca2: "UA",
            code: "380"
        }, {
            name: "United Arab Emirates",
            cca2: "AE",
            code: "971"
        }, {
            name: "United Kingdom",
            cca2: "GB",
            code: "44"
        }, {
            name: "United States",
            cca2: "US",
            code: "1"
        }, {
            name: "Uruguay",
            cca2: "UY",
            code: "598"
        }, {
            name: "Uzbekistan",
            cca2: "UZ",
            code: "998"
        }, {
            name: "Vanuatu",
            cca2: "VU",
            code: "678"
        }, {
            name: "Vatican City",
            cca2: "VA",
            code: "379"
        }, {
            name: "Venezuela",
            cca2: "VE",
            code: "58"
        }, {
            name: "Viet Nam",
            cca2: "VN",
            code: "84"
        }, {
            name: "Virgin Islands (British)",
            cca2: "VG",
            code: "1284"
        }, {
            name: "Virgin Islands (U.S.)",
            cca2: "VI",
            code: "1340"
        }, //{"name":"Wallis and Futuna","cca2":"WF",code:"681"},
        {
            name: "Western Sahara",
            cca2: "EH",
            code: "212"
        }, {
            name: "Yemen",
            cca2: "YE",
            code: "967"
        }, {
            name: "Zambia",
            cca2: "ZM",
            code: "260"
        }, {
            name: "Zimbabwe",
            cca2: "ZW",
            code: "263"
        } ];
    var methods = {
        init: function (options) {
            var element = this;
            var settings = $.extend({
                'prefix': "",
                'defaultCode' : 65,
                'code' : '',
                'countryCode' : '',
                'phone' : '',
                'phoneDigits' : '',
                'countryInputTabIndex' : '',
                'phoneInputTabIndex' :'',
                onChange: function(phoneWithCode) { },
                onLoad: function (phoneWithCode) { }
            }, options);
            _settings = settings;
            var $element = $(element);
            $element.html(
                [
                    '<div class="js-mod-country-code-phone-input">',
                    '<span id="country-input" class="country-input">',
                    '<input id="' + _settings.prefix + 'ddlCountry" tabindex="' + _settings.countryInputTabIndex + '" />',
                    '</span>',
                    '<span class="phone-input">',
                    '<input class="form-control" placeholder="Enter Phone" id="' + _settings.prefix + 'tbPhoneNumber" type="text"tabindex="' + _settings.phoneInputTabIndex + '" />',
                    '</span>',
                    '</div>'
                ].join(''));

            methods._countryCodeToLower(_countryData);
            methods._getCountryInfo(settings.prefix);

            //bind on change function for the phone number
            $('#' + settings.prefix + 'tbPhoneNumber').bind('change', function () {
                var phoneNumber = $("#" + _settings.prefix + "tbPhoneNumber").val();
                var regex = /[0-9\(\)\-\ ]+$/;
                if (!regex.test(phoneNumber)) {
                    alert("Please input a valid phone number");
                    $("#" + _settings.prefix + "tbPhoneNumber").val();
                }
                var phoneWithCode = new Object();
                phoneWithCode.code = $('#' + settings.prefix + 'ddlCountry').data("kendoDropDownList").value();
                phoneWithCode.countryCode = methods._getCountryCodeFromCode(phoneWithCode.code);
                phoneWithCode.phone = $('#' + settings.prefix + 'tbPhoneNumber').val();
                phoneWithCode.phoneDigits = "+" + phoneWithCode.code + phoneWithCode.phone;
                phoneWithCode.countryName = methods._getCountryNameFromCountryCode(phoneWithCode.countryCode);
                _settings.onChange(phoneWithCode); //return the phone with code
            });
        },
        _getCodeFromCountryCode: function (countryCode) {
            var code = "";
            for (var i = 0; i < _countryData.length; i++) {
                if (_countryData[i].cca2 == countryCode) {
                    code = _countryData[i].code;
                    break;
                }
            }
            return code;
        },
        _getCountryCodeFromName: function (name){
            var cca2 = "";
            for (var i = 0; i < _countryData.length; i++) {
                if (_countryData[i].name == name) {
                    cca2 = _countryData[i].cca2;
                    break;
                }
            }
            return cca2;
        },
        _getCountryCodeFromCode: function (code) {
            var countryCode = "";
            for (var i = 0; i < _countryData.length; i++) {
                if (_countryData[i].code == code) {
                    countryCode = _countryData[i].cca2;
                    break;
                }
            }
            return countryCode;
        },
        _getCountryNameFromCountryCode: function (countryCode){
            var countryName = "";
            for (var i = 0; i < _countryData.length; i++) {
                if (_countryData[i].cca2 == countryCode) {
                    countryName = _countryData[i].name;
                    break;
                }
            }
            return countryName;
        },
        _countryCodeToLower: function (countryData) {
            var countryDataLower;
            for (var i = 0; i < countryData.length; i++) {
                countryDataLower = countryData[i].cca2.toLowerCase();
                countryData[i].cca2 = countryDataLower;
            }
        },
        _getCountryInfo: function (prefix) {
            $('#' + prefix + 'ddlCountry').kendoDropDownList({
                dataSource: _countryData,
                value: _settings.defaultCode,
                dataTextField: "name",
                dataValueField: "code",
                template: '<img src="blank.gif" class="flag flag-${cca2}" data-cca="${cca2}" /><span> ${name} (+${code})</span>',
                change: function () {
                    var name = $('#' + prefix + 'ddlCountry').data("kendoDropDownList").text();
                    var code = $('#' + prefix + 'ddlCountry').data("kendoDropDownList").value();
                    var cca2 = methods._getCountryCodeFromName(name);
                    $("#country-input .k-dropdown .k-input").html('<img src="blank.gif" class="flag flag-' + cca2 + '"  data-cca="' + cca2 + '"/><span> (+' + code + ') ' + name + '</span>');

                    var phoneWithCode = new Object();
                    phoneWithCode.countryCode = cca2;
                    phoneWithCode.code = code;
                    phoneWithCode.phone = $('#' + prefix + 'tbPhoneNumber').val();
                    phoneWithCode.phoneDigits = "+" + code + $('#' + prefix + 'tbPhoneNumber').val();
                    phoneWithCode.countryName = methods._getCountryNameFromCountryCode(phoneWithCode.countryCode);
                    _settings.onChange(phoneWithCode); //return the phone with code
                },
                dataBound: function () {
                    if (_settings.code && _settings.countryCode && _settings.phone && _settings.phoneDigits){
                        var name = methods._getCountryNameFromCountryCode(_settings.countryCode);
                        var code = _settings.code;
                        var countryCode = _settings.countryCode;
                        //set the values from the settings
                        $('#' + prefix + 'ddlCountry').data("kendoDropDownList").value(code);
                        $("#country-input .k-dropdown .k-input").html('<img src="blank.gif" class="flag flag-' + countryCode + '"  data-cca="' + countryCode + '"/><span> (+' + code + ') ' + name + '</span>');
                        $('#' + prefix + 'tbPhoneNumber').val(_settings.phone);

                        var phoneWithCode = new Object();
                        phoneWithCode.countryCode = _settings.countryCode;
                        phoneWithCode.code = _settings.code;
                        phoneWithCode.phone = _settings.phone;
                        phoneWithCode.phoneDigits = _settings.phoneDigits;
                        phoneWithCode.countryName = methods._getCountryNameFromCountryCode(phoneWithCode.countryCode);
                        _settings.onLoad(phoneWithCode);
                    }else{
                        var name = $('#' + prefix + 'ddlCountry').data("kendoDropDownList").text();
                        var code = $('#' + prefix + 'ddlCountry').data("kendoDropDownList").value();
                        var cca2 = methods._getCountryCodeFromName(name);
                        $("#country-input .k-dropdown .k-input").html('<img src="blank.gif" class="flag flag-' + cca2 + '"  data-cca="' + cca2 + '"/><span> (+' + code + ') ' + name + '</span>');
                        var phoneWithCode = new Object();
                        phoneWithCode.countryCode = cca2;
                        phoneWithCode.code = code;
                        phoneWithCode.phone = $('#' + prefix + 'tbPhoneNumber').val();
                        phoneWithCode.phoneDigits = "+" + code + $('#' + prefix + 'tbPhoneNumber').val();
                        phoneWithCode.countryName = methods._getCountryNameFromCountryCode(phoneWithCode.countryCode);
                        _settings.onLoad(phoneWithCode);
                    }
                }
            });
        },
        setCountryCodeAndPhone: function (prefix, phoneWithCode) {
            //countryCode = sg
            //phone = 92830495
            //phoneDigits = 659239894 - autoconcatenated
            //code = 65?
            var countryCode = phoneWithCode.countryCode;
            var phone = phoneWithCode.phone;
            var code = methods._getCodeFromCountryCode(countryCode);
            var phoneDigits = "";
            var name = "";

            if (code) {
                phoneDigits = "+" + code + phoneWithCode.phone;
                name = methods._getCountryNameFromCountryCode(countryCode);
                $('#' + prefix + 'ddlCountry').data("kendoDropDownList").value(code);
                $("#country-input .k-dropdown .k-input").html('<img src="blank.gif" class="flag flag-' + countryCode + '"  data-cca="' + countryCode + '"/><span> (+' + code + ') ' + name + '</span>');
            }
            $('#' + prefix + 'tbPhoneNumber').val(phone);

            //on Loaded, it will call back and return the phone details set.
            var loadedPhoneWithCode = new Object();
            loadedPhoneWithCode.countryCode = countryCode;
            loadedPhoneWithCode.phone = phone;
            loadedPhoneWithCode.phoneDigits = phoneDigits;
            loadedPhoneWithCode.code = code;
            loadedPhoneWithCode.countryName = methods._getCountryNameFromCountryCode(loadedPhoneWithCode.countryCode);;

            _settings.onLoad(loadedPhoneWithCode);
        }
    }

    $.fn.countryCodePhoneInput = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }

        $(element).load(function () {

        });
    };

});