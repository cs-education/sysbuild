import 'jquery-notific8';

const notifi8Options = {
    red: {
        life: 5000,
        theme: 'ruby',
        icon: 'exclamation-triangle',
    },
    yellow: {
        life: 5000,
        theme: 'lemon',
        icon: 'info-circled',
    },
    green: {
        life: 5000,
        theme: 'lime',
        icon: 'check-mark-2',
    },
};

class Notifications {
    notify(message, type) {
        $.notific8(message, notifi8Options[type]);
    }
}

export default (new Notifications());
