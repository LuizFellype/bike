import { FBDatabase } from "../firebaseConfig"
import { normalizeOS } from "../helpers/normalizeOS"

export const getOsLastNumber = async (numberAdded) => {
    const osNumRef = await FBDatabase.doc('os/lastNumber')
    const snapShot = await osNumRef.get()

    if (!snapShot.exists) {
        try {
            await osNumRef.set({ value: 0 });
            return 0
        } catch (error) {
            console.log('error creating user', error.message);
            throw new Error('Erro ineseperado.')
        }
    }
    const data = snapShot.data()

    return data.value;
}
export const setOsLastNumber = async (number) => {
    await FBDatabase.doc('os/lastNumber').set({ value: number })
}


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
//     services: [{ service: 'Revisão geral', value: '131,50' }],
//     color: 'PRETA',
//     value: '10',
//     osNumber: '1',
//     date: new Date().getTime()
// }

export const getAllByOSOrPhone = async (OSOrPhone) => {
    let data = []

    const snapshotByDate = await FBDatabase.collection('os')
        .where('osNumber', '==', Number(OSOrPhone))
        .get()

    const snapshot = await FBDatabase.collection('os')
        .where('phone', '==', OSOrPhone)
        .get()

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