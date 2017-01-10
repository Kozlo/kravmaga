import AuthActions from '../actions/AuthActions';

export const httpStatusCode = {
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
        AuthActions.silentLogoutUser();
    }
};

export const getAuthorizationHeader = () => {
    const token = AuthActions.getToken();

    return { 'Authorization': `Bearer ${token}` };
};

export const httpErrorHandler = e => {
    // skip the error codes that have been handled
    const handledStatuses = Object.keys(httpStatusCode);
    const indexOfStatus = handledStatuses.indexOf(e.status.toString());

    if (indexOfStatus !== -1) return;

    console.error(e);
    toastr.error('Pieprasījums neveiksmīgs - neparedzēta kļūda!');
};


export const httpSuccessHandler = data => console.log('Data received: ', data);
