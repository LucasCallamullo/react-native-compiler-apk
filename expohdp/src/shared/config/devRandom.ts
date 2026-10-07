// src/shared/utils/devRandom.ts

const FIRST_NAMES = [
  'Mara', 'Juan', 'Sofía', 'Lucas', 'Tomy', 'Camila',
  'Mateo', 'Valentina', 'Nico', 'Julieta', 'Franco', 'Lucía',
];

const LAST_NAMES = [
  'Ayuda', 'Pérez', 'Gómez', 'Rodríguez', 'Fernández', 'López',
  'Martínez', 'Sosa', 'Díaz', 'Romero', 'Torres', 'Silva',
];

const pick = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const randomName = (): string =>
  `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;

export const randomEmail = (name?: string): string => {
  const base = (name ?? randomName())
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // saca tildes
    .replace(/[^a-z]+/g, '.')        // espacios/símbolos → punto
    .replace(/^\.+|\.+$/g, '');      // trim puntos
  const suffix = Math.floor(Math.random() * 900) + 100; // 100-999
  return `${base}${suffix}@test.com`;
};

export const randomPhone = (): string => {
  // Formato AR-ish: 11 + 8 dígitos
  const n = Math.floor(Math.random() * 90_000_000) + 10_000_000;
  return `11${n}`;
};




export const randomContact = () => {
  const name = randomName();
  return {
    name,
    email: randomEmail(name),
    phone: randomPhone(),
  };
};