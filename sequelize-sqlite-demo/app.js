const path = require('path');

const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'), 
});


const Car = sequelize.define('Car', {
  brand: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  year: {
    type: DataTypes.INTEGER, 
  },
  price: {
    type: DataTypes.FLOAT, 
  },
  isAvailable: {
    type: DataTypes.BOOLEAN, 
    defaultValue: true,
  }
}, {
  tableName: 'cars', 
  timestamps: true,  
});


async function main() {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно.');
    await sequelize.sync({ force: true });
    console.log('Таблица cars синхронизирована.');

   
    await Car.bulkCreate([
      { brand: 'Rino', model: 'Logan', year: 2022, price: 2899000, isAvailable: true },
      { brand: 'Lada', model: 'Vesta', year: 2021, price: 1250000, isAvailable: false },
      { brand: 'Tesla', model: 'Model 3', year: 2023, price: 4500000, isAvailable: true }
    ]);
    console.log('Добавлены записи в таблицу cars.');

    
    const cars = await Car.findAll({ order: [['id', 'ASC']] });

    console.log('\nСписок автомобилей:');
    cars.forEach(car => {
      const c = car.toJSON();
      console.log(
        `ID: ${c.id} | ${c.brand} ${c.model} | ` +
        `Год: ${c.year} | Цена: ${c.price} ₽ | ` +
        `Доступен: ${c.isAvailable ? 'да' : 'нет'}`
      );
    });

  } catch (error) {
    console.error('Ошибка при работе с базой данных:', error);
  } finally {
    await sequelize.close();

  }
}


main();