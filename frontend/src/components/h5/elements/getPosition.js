const getPosition = style => {
    const x = style.left ? parseInt(style.left) : 0;
    const y = style.top ? parseInt(style.top) : 0;
    return { x, y };
};

export default getPosition;
