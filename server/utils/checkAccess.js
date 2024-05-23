const Access_link = require('../model/Access_link');


exports.checkAccess = async (type, text, user_id) => {
    if (!text) return { status: false, message: 'Текст не найден' };
    if (text?.author?._id.toString() === user_id) return { status: true, message: '' };
    switch (type) {
        case 'edit':
        case 'delete':
        case 'update':
            return await checkAccessForEdit(text, user_id);
        case 'read':
        case 'copy':
        case 'add_to_favorites':
            return await checkAccessForRead(text, user_id);
        case 'read_with_access_link':
            return await checkAccessForReadWithAccess_link(text, user_id);
        case 'rate':
            return { status: true, message: '' };
        default:
            return { status: false, message: 'Неизвестный тип доступа' };
    }
};
const checkAccessForEdit = async (text, user_id) => {
    if (text.author._id.toString() !== user_id) {
        return { status: false, message: 'Вы не автор данного текста' };
    }
    return { status: true, message: '' };
};

const checkAccessForRead = async (text, user_id) => {
    if (text.author._id.toString() !== user_id) {
        if (text.accessLevel === 'private') return { status: false, message: 'Текст не доступен' };
        if (text.accessLevel === 'access_link') {
            const access_link = await Access_link.findOne({ user: user_id, text: text._id }).exec();
            if (!access_link) return { status: false, message: 'Текст доступен только по ссылке от автора' };
        }
    }
    return { status: true, message: '' };
};

const checkAccessForReadWithAccess_link = async (text, user_id) => {
    if (text.author._id.toString() !== user_id) {
        if (text.accessLevel === 'private') return { status: false, message: 'Текст не доступен' };
    }
    return { status: true, message: '' };
};

