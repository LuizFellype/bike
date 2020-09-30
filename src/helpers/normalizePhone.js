export const normalizePhone = (phone, removeDash = true) => {
    const phoneAsString = `${phone}`
    if (removeDash) {
        return phoneAsString.split('-').join('')
    }

    return phoneAsString.slice(undefined, 5) + '-' + phoneAsString.slice(5)
}

export const normalizeOS = (removeDashFromPhone = true) => (OS) => {
    return { ...OS, phone: normalizePhone(OS.phone, removeDashFromPhone) }
}

