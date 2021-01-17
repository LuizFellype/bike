import { formatServicesAndPecasToReport } from "./normalizeOS"

const services = [{ service: 'Revisao geral', value: "150,00" }, { service: 'Revisao especifica', value: "200,00" }]
const pecas = [{ peca: 'Pedal', value: "100,00" }]
const mockServices = [
    { peca: 'Pedal', pecaValue: "100,00", service: 'Revisao geral', value: "150,00" }, { service: 'Revisao especifica', value: "200,00" }, { total: 450 }
]

test('normalizeServicesAndPecas: ', () => {
    expect(formatServicesAndPecasToReport(services, pecas)).toEqual(mockServices)
})