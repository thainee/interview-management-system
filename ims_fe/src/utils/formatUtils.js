import { format } from 'date-fns';

export const formatText = (text) => {
    if (text == null) return '';
    text = text.toLowerCase();
    if (text === 'hr') return text.toUpperCase();
    if (text === 'it') return text.toUpperCase();
    if (text === 'phd') return 'PhD';
    if (text === 'cpp') return 'C++';
    if (text === 'dot_net') return '.NET';
    if (text === 'nodejs') return 'NodeJS';

    return text
        .split('_')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

export const formatDate = (date) => !date ? "N/A" : format(new Date(date), "dd/MM/yyyy");

export const formatDateRequest = (date) => !date ? "N/A" : format(new Date(date), "yyyy-MM-dd");

export const formatTime = (time) => !time ? "N/A" : format(new Date(time), "hh:mm");
