import AuthActions from '../actions/AuthActions';
import UserActions from '../actions/UserActions';

// TODO: replace 'auth' with something more generic and use everywhere
export const authStatusCode = {
    200: user => {
        console.log('User received successfully: ', user);
        UserActions.userReceived(user);
    },
    401: res => {
        console.error(res);
        toastr.error('Autorizācijas kļūda - mēģiniet vēlreiz!');
        // TODO: replace with a 'silent logout'
        AuthActions.logoutUser();
    },
    403: res => {
        console.error(res);
        toastr.error('Lietotājs bloķēts - Sazinieties ar administratoru!');
        // TODO: replace with a 'silent logout'
        AuthActions.logoutUser();
    },
    500: res => {
        console.error(res);
        toastr.error('Servera kļūda - mēģiniet vēlreiz!');
        // TODO: replace with a 'silent logout'
        AuthActions.logoutUser();
    }
};

export const authErrorHandler = e => {
    // skip the error codes that have been handled
    const handledStatuses = Object.keys(authStatusCode);
    const indexOfStatus = handledStatuses.indexOf(e.status.toString());

    if (indexOfStatus !== -1) return;

    console.error(e);
    toastr.error('Autorizācija neveiksmīga - neparadzēta kļūda!');
};

export const authSuccessHandler = data => console.log('User received: ', data);

export const getProfile = auth => {
    // TODO: replace user_id with _id if possible
    const request = {
        url: '/get-profile',
        method: 'POST',
        data: { user_id: auth.profile.user_id },
        headers: { 'Authorization': `Bearer ${auth.token}` },
        statusCode: authStatusCode
    };
    $.ajax(request)
        .done(authSuccessHandler)
        .fail(authErrorHandler);
};