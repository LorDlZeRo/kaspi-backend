

export const getAmountPages = async (ProductsModel, object, limit) => {

    const totalProducts = await ProductsModel.countDocuments(object);

    return  Math.ceil(totalProducts/limit)
}