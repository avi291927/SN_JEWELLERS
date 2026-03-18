export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
};

export const capitalize = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};

export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return path;
};

export const subcategories = [
    { value: 'necklace', label: 'Necklace' },
    { value: 'ring', label: 'Ring' },
    { value: 'earring', label: 'Earring' },
    { value: 'bracelet', label: 'Bracelet' },
    { value: 'bangle', label: 'Bangle' },
    { value: 'pendant', label: 'Pendant' },
    { value: 'chain', label: 'Chain' },
    { value: 'anklet', label: 'Anklet' },
    { value: 'other', label: 'Other' },
];
