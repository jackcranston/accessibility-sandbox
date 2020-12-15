export const getDevice = () => {
  const devices = [
    {
      name: 'DESKTOP',
      width: 768
    },
    {
      name: 'MOBILE',
      width: 0
    },
  ];

  const getDevice = devices.find((device) => {
    if (window.matchMedia(`(min-width: ${device.width}px)`).matches) {
      return device.name;
    }
  });

  return getDevice.name;
};
