export const pagination = (currentPageNumber, amountPages) => {
    let pages = []

    const paginationLength = amountPages < 5? amountPages: 5;
    for (let index = 1; index <= paginationLength; index++) {

        if (currentPageNumber < 4 ) {
            pages = [...pages, index]
        } else 
        if (currentPageNumber >= 4 && currentPageNumber <= (amountPages-2)) {
            pages = [...pages, (currentPageNumber-3) + index]
        } else 
        if (currentPageNumber >= (amountPages-2) || currentPageNumber == (amountPages-1)) {
            pages = [...pages, (amountPages-paginationLength) + index]
        }
       
} 

    return pages
}