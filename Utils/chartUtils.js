// src/utils/chartUtils.js
export const generateDynamicSeries = (
    data = [],
    {
        excludeKeys = [],
        labelFormatter = (key) =>
            key.replace(/_/g, " ").toUpperCase(),
        defaultValue = 0,
    } = {}
) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const keys = Object.keys(data[0]).filter(
        (key) => !excludeKeys.includes(key)
    );
    return keys.map((key) => ({
        name: labelFormatter(key),
        data: data.map((item) => item?.[key] ?? defaultValue),
    }));
};
