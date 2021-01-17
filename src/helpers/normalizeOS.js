import { mergeDeepWith, concat } from 'ramda'

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

export const cleanServicesAndPecas = (arr, key) => {
    const filtered = arr.filter(item => {
        return !!item[key] && !!item.value && Number(normalizeCurrency(item.value)) > 0
    })

    return filtered
}

export const normalizeOS = () => (OS) => {
    return OS
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

const getTotalOfValues = (arr) => arr.reduce((acc, { value }) => {
    return acc + normalizeCurrency(value)
}, 0)

export const formatServicesAndPecasToReport = (services = [], pecas = []) => {
    const servicesTotal = getTotalOfValues(services)
    const pecasTotal = getTotalOfValues(pecas)

    const pecasNormalized = pecas.map(({ value, ...item }) => ({ ...item, pecaValue: value }))

    const allTogether = Object.values(mergeDeepWith(concat, services, pecasNormalized))

    return { data: allTogether, services: servicesTotal, pecas: pecasTotal, total: servicesTotal + pecasTotal }
}