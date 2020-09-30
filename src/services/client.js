import {FBDatabase} from "../firebaseConfig"

export const createOS = async (dataToAdd) => {
    const res = await FBDatabase.ref('os/').set(dataToAdd)    
    console.log(res)
}

const fake = {
  name: 'NOME',
  phone: '98852-1801',
  services: 'PASTILHAS',
  color: 'PRETA',
  value: '10',
  date: new Date().getTime()
}
export const getAllByOSOrPhone = async (dataToAdd) => {
    return [fake]
}