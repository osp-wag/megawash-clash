import fs from 'fs'

const mockFs = jest.genMockFromModule<typeof fs>("fs");

mockFs.readFileSync = fs.readFileSync
mockFs.appendFileSync = jest.fn()

export default mockFs
