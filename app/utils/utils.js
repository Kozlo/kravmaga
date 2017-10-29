import AuthStore from '../stores/AuthStore';
import AuthActions from '../actions/AuthActions';
import { generalConfig } from './config';

/**
 * Creates an authorization header with the passed JWT token
 *
 * @public
 * @param {string} token Authorization token
 * @returns {Object} Authorization header
 */
export const getAuthorizationHeader = token => {
    return { 'Authorization': `Bearer ${token}` };
};

/**
 * HTTP request error handler.
 *
 * Logs the HTTP error to the console and indicates to the user that there was an unexpected error.
 *
 * @public
 * @param {Object} e Error
 */
export const httpErrorHandler = e => {
    // skip the error codes that have been handled
    const handledStatuses = Object.keys(httpStatusCode);
    const indexOfStatus = handledStatuses.indexOf(e.status.toString());

    if (indexOfStatus !== -1) return;

    console.error(e);
    toastr.error('Pieprasījums neveiksmīgs - neparedzēta kļūda!');
};

/**
 * Logs the returned values.
 *
 * @public
 * @param {*} data Received data
 */
export const httpSuccessHandler = data => console.log('Data received: ', data);

/**
 * Determines if the email is a valid email.
 *
 * @public
 * @param {string} email
 * @returns {boolean} Flag showing if the email is valid
 */
export const isEmailValid = email => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

/**
 * Determines if the password passes the necessary complexity rules.
 *
 * @public
 * @param {string} password User's password
 * @returns {boolean} Flag showing if the password is valid
 */
export const isPasswordValid = password => {
    return typeof password === 'string' && password.length >= 5;
};

/**
 * Determines the display value of a user's gender.
 *
 * @public
 * @param gender
 * @returns {string}
 */
export const getGenderValue = gender => {
    return gender == 'male' ? 'Vīrietis' : (gender == 'female' ? 'Sieviete' : '');
};

/**
 * Determines the display value of a user's role.
 *
 * @public
 * @param {boolean} is_blocked Flag showing if the user is blocked
 * @returns {string} Display value
 */
export const getRoleValue = role => {
    return role === 'admin' ? 'admins' : (role === 'user' ? 'lietotājs' : '');
};

/**
 * Determines the display value of a user's status.
 *
 * @public
 * @param {boolean} is_blocked Flag showing if the user is blocked
 * @returns {string} Display value
 */
export const getStatusValue = is_blocked => {
    return is_blocked === true ? 'bloķēts' : (is_blocked === false ? 'aktīvs' : '');
};

/**
 * Converts the passed date string to date and return it in the format DD/MM/YYY.
 *
 * @public
 * @param {string} dateString Date string
 * @param {boolean} [addTime] Flag showing if time should be added to the date
 * @returns {string} Formatted date string or an empty string
 */
export const formatDateString = (dateString, addTime = false) => {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let formattedDate = `${day}/${month}/${year}`;

    if (!addTime) {
        return formattedDate;
    } else {
        const hours = formatTimeDigit(date.getHours());
        const minutes = formatTimeDigit(date.getMinutes());

        return `${formattedDate} ${hours}:${minutes}`;
    }
};

/**
 * Formats the time digit by adding a trailing 0 if the number is in single digits.
 *
 * @public
 * @param {number} digit Digit to format
 * @returns {string} constructed string
 */
export const formatTimeDigit = (digit) => {
    return digit < 10 ? `0${digit}` : digit;
};

/**
 * Initializes the datetime picker with the specified ID.
 *
 * Additionally adds the default date if it's passed.
 *
 * @public
 * @param {string} datetimePickerSelector Control selector
 * @param {Function} dateChangedHandler Date changed event handler
 * @param {Date} [defaultDate] date string
 * @param {boolean} [addTime] Flag showing if time should be added instead of only date
 */
export const initDateTimePicker = (datetimePickerSelector, dateChangedHandler, defaultDate, addTime = false) => {
    $(() => {
        const dateTimePicker = $(datetimePickerSelector);
        const { dateOnlyFormat, dateTimeFormat } = generalConfig;
        const format = addTime ? dateTimeFormat : dateOnlyFormat;
        const options = { format };

        if (defaultDate) {
            const newDate = new Date(defaultDate);

            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
            options.date = newDate;
        }

        dateTimePicker.datetimepicker(options);
        dateTimePicker.on("dp.change", e => dateChangedHandler(e.date.toString()));
    });

    $(datetimePickerSelector).show('slow', function() {
        $(this).trigger('isVisible');
    });
};

/**
 * Date field value change handler.
 *
 * Uses the passed entry actions to set the updatable.
 *
 * @public
 * @param {string} prop Property name to udpate
 * @param {Object} entryActions Entry store actions
 * @param {Object} updatable Updatable entry
 * @param {boolean} [clearHours] Flag showing if the hours and the minutes should be cleared
 * @param {string} date New date string value
 */
export const handleDateChange = (prop, entryActions, updatable, clearHours, date) => {
    date = date && date !== 'false' ? date : '';

    if (date !== '') {
        console.log(date);
        date = new Date(date);

        if (clearHours) {
            date.setHours(0,0,0,0);
        }
    }

    updatable[prop] = date;

    entryActions.setUpdatable(updatable);
};

/**
 * Replaces admin fields property with prefixed admin fields on the parent object.
 *
 * Creates a new object and deletes the admin_fields object as it's not needed anymore.
 *
 * @public
 * @param {Object} props User properties
 * @returns {Object} Updated properties
 */
export const prefixAdminFields = props => {
    const { admin_fields } = props;

    if (!admin_fields) {
        return props;
    }

    const newAdminFields = prefixProps(props.admin_fields, 'admin_fields');
    const newProps = $.extend({}, props, newAdminFields);

    delete newProps.admin_fields;

    return newProps;
};

/**
 * Creates a new object with prefixed property names.
 *
 * @public
 * @param {Object} obj Object to take properties from
 * @param {string} prefix Prefix to use
 * @returns {Object} Prefixed object
 */
export const prefixProps = (obj, prefix) => {
    const dotObj = {};

    Object.keys(obj).forEach(key => dotObj[`${prefix}.${key}`] = obj[key]);

    return dotObj;
};

/**
 * Calculates how many members there are in a group.
 *
 * @public
 * @param {string} groupId Group id
 * @param {Object[]} groupMembers Group members object containing all group members
 * @returns {number} Group member count
 */
export const getGroupMemberCount = (groupId, groupMembers) => {
    const members = groupMembers[groupId];

    return members ? members.length : 0;
};

/**
 * Creates an object with the specified properties from the source object.
 * If the properties are not there, initializes them as empty strings.
 *
 * @public
 * @param {string[]} propNames Property names to copy
 * @param {Object} sourceObject Object to copy the properties from
 * @returns {Object} The new object
 */
export const createObject = (propNames, sourceObject) => {
    const newObject = {};

    propNames.forEach(propName => {
        const sourceValue = sourceObject[propName];

        if (typeof sourceValue !== 'undefined') {
            newObject[propName] = sourceValue;
        } else {
            newObject[propName] = '';
        }
    });

    return newObject;
};

/**
 * Makes an ajax request to the back-end with the passed request options.
 *
 * @public
 * @param {Object} request Request
 * @returns {*}
 */
export const fetchData = request => {
    return $.ajax(request)
        .done(data => httpSuccessHandler(data))
        .fail(error => httpErrorHandler(error));
};

/**
 * Updates the list of the specified store.
 *
 * Uses the stores current filters, sorters, config and the default list received handler.
 *
 * @public
 * @param {Object} store Store
 * @param {Object} actions Actions
 */
export const updateStoreList = (store, actions) => {
    const { token } = AuthStore.getState();
    const { filters, sorters, config } = store.getState();

    actions.getList(token, actions.listReceived, filters, sorters, config);
};

/**
 * Checks if the passed value is a valid URL.
 *
 * @public
 * @param {string} url URL to check
 * @returns {boolean} Flag showing if the value is a valid URL
 */
export const isUrlValid = url => {
    const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    return pattern.test(url);
};

/**
 * Created a string with the user's name, surname and email.
 *
 * Checks if first/last name properties exist as they are optional.
 *
 * @param {User} user User object
 * @returns {string} HTML
 * @public
 */
export const formatUserDescription = user => {
    const { given_name, family_name, email } = user;
    let description = '';

    if (given_name) description += `${given_name} `;
    if (family_name) description += `${family_name} `;

    return `${description}(${email})`;
};

/**
 * Constructs a string consisting of a user's email, name, and last name.
 *
 * @private
 * @param {string} email User's email
 * @param {string} given_name User's first name
 * @param {string} family_name User's last name
 * @returns {string} Constructed user info
 */
export const constructUserInfo = (email, given_name, family_name) => {
    return `${email} (${given_name || ''} ${family_name || ''})`;
};

export const constructUserOptions = (userList) => {
    return userList.map(
        ({ _id, email, given_name, family_name }) => {
            return {
                id: _id,
                label: constructUserInfo(email, given_name, family_name)
            };
        }
    );
};

/**
 * HTTP error status codes.
 *
 * @property 400 Bad request
 * @property 401 Unauthorized
 * @property 403 Forbidden
 * @property 404 Not found
 * @property 409 Conflict
 * @property 500 Internal server error
 */
export const httpStatusCode = {
    400: res => {
        console.error(res);
        toastr.error('Pieprasījuma kļūda - mēģiniet vēlreiz!');
    },
    401: res => {
        console.error(res);
        toastr.error('Autorizācijas kļūda - mēģiniet vēlreiz!');
        AuthActions.silentLogoutUser();
    },
    403: res => {
        console.error(res);
        toastr.error('Lietotājs bloķēts - sazinieties ar administratoru!');
        AuthActions.silentLogoutUser();
    },
    404: res => {
        console.error(res);
        toastr.error('Pieprasītais saturs netika atrasts - sazinieties ar administratoru!');
    },
    409: res => {
        console.error(res);
        toastr.error('Noticis datu apstrādes konflikts - sazinieties ar administratoru!');
    },
    500: res => {
        console.error(res);
        toastr.error('Servera kļūda - mēģiniet vēlreiz!');
    }
};
