import { FBDatabase } from "../firebaseConfig"
import { normalizeOS } from "../helpers/normalizeOS"

export const createOS = async (dataToAdd) => {
    const dataNormalized = normalizeOS(true)(dataToAdd)
    const res = await FBDatabase.collection('os').add(dataNormalized)

    return { ...dataToAdd, id: res.id }
}

export const updateOSById = async ({ id, ...dataToUpdate }, osId) => {
    const dataNormalized = normalizeOS(true)(dataToUpdate)
    await FBDatabase.collection('os').doc(osId).update(dataNormalized)

    return { ...dataToUpdate, id: osId }
}

// const fake = {
//     name: 'NOME',
//     phone: '98852-1801',
//     services: [{ service: 'Revisão geral', value: '130,00' }],
//     color: 'PRETA',
//     value: '10',
//     date: new Date().getTime()
// }

export const getAllByOSOrPhone = async (OSOrPhone) => {
    let data = []

    const snapshotByDate = await FBDatabase.collection('os')
        .where('date', '==', Number(OSOrPhone))
        .get()

    const snapshot = await FBDatabase.collection('os')
        .where('phone', '==', OSOrPhone)
        .get()

    // console.log({snapshot, snapshotByDate})

    if (snapshot.empty && snapshotByDate.empty) {
        // console.log('No matching documents.');
        return []
    }

    const pushToData = (doc) => {
        data = [...data, normalizeOS(false)({ ...doc.data(), id: doc.id })]
    }

    snapshotByDate.forEach(pushToData)
    snapshot.forEach(pushToData)

    // console.log('data', data)

    return data.reverse()
}