const handleChange = async (selected, key) => {
    setObjToData((prev) => ({ ...prev, [key]: selected }));
}