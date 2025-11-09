const now = new Date();


export const minDate = new Date(now.getFullYear()-5, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
export const maxDate = new Date(now.getFullYear()+10, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
