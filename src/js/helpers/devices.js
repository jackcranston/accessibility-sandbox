export const deviceWidth = () => {
  const devices = [
    {
      name: 'DESKTOP',
      width: 768
    },
    {
      name: 'TABLET',
      width: 320
    },
    {
      name: 'MOBILE',
      width: 0
    },
  ];

  return devices.find((device) => {
    if (window.matchMedia(`(min-width: ${device.width}px)`).matches) {
      return device.name;
    }
  });
};
