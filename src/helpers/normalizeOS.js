export const normalizePhone = (phone, removeDash = true) => {
    const phoneAsString = `${phone}`
    if (removeDash) {
        return phoneAsString.split('-').join('')
    }

    return phoneAsString.slice(undefined, 5) + '-' + phoneAsString.slice(5)
}

export const normalizeCurrency = (currency, reverse = false) => {
    const currencyAsString = `${currency || 0}`
    if (reverse) { 
        return currencyAsString.replace('.', ',')
    }
    return Number(currencyAsString.replace(/\./g, '').replace(',', '.'))
}

export const normalizeOS = (removeDashFromPhone = true) => (OS) => {
    return { ...OS, phone: normalizePhone(OS.phone, removeDashFromPhone) }
}


export const updateItembyIndex = (idx, arr, itemToUpdate) => {
    if (!idx) {
        return [itemToUpdate, ...arr.slice(1)]
    }

    const before = arr.slice(0, idx)
    const after = arr.slice(idx + 1)

    const arrModified = [...before, itemToUpdate, ...after]

    return arrModified
}