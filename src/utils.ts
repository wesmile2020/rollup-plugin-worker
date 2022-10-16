const LUT: string[] = [];
for (let i = 0; i < 256; i += 1) {
  LUT[i] = (i < 16 ? '0' : '') + (i).toString(16);
}

let id = Math.random();
export function generateUUID() {
  // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
  const d0 = Math.random() * 0xffffffff | 0;
  const d1 = Math.random() * 0xffffffff | 0;
  const d2 = Math.random() * 0xffffffff | 0;
  const d3 = id * 0xffffffff | 0;

  // eslint-disable-next-line prefer-template
  const uuid = LUT[d0 & 0xff] + LUT[d0 >> 8 & 0xff] + LUT[d0 >> 16 & 0xff] + LUT[d0 >> 24 & 0xff] + '-'
    + LUT[d1 & 0xff] + LUT[d1 >> 8 & 0xff] + '-'
    + LUT[d1 >> 16 & 0x0f | 0x40] + LUT[d1 >> 24 & 0xff] + '-'
    + LUT[d2 & 0x3f | 0x80] + LUT[d2 >> 8 & 0xff] + '-'
    + LUT[d2 >> 16 & 0xff] + LUT[d2 >> 24 & 0xff] + LUT[d3 & 0xff] + LUT[d3 >> 8 & 0xff] + LUT[d3 >> 16 & 0xff] + LUT[d3 >> 24 & 0xff];

  id += Math.random();

  // .toUpperCase() here flattens concatenated strings to save heap memory space.
  return uuid.toUpperCase();
}