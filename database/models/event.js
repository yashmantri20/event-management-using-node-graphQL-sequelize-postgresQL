module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    eventName: DataTypes.STRING,
    description: DataTypes.STRING,
    date: DataTypes.STRING,
  });

  Event.associate = (models) => {
    Event.hasMany(models.Guest, {
      foreignKey: 'eventId',
      as: 'guests',
    });
    Event.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Event;
};