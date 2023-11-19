import readlineSync from 'readline-sync'

const mockReadline = jest.genMockFromModule<typeof readlineSync>("readline-sync");

export default mockReadline;
