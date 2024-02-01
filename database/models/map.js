'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Map extends Model {
    static associate(models) {
      this.belongsTo(models.Server, {
        foreignKey: {
          name: 'server_name',
          allowNull: false,
        }
      })
    }

    // Generate all positions for this map
    async generateMapPositions() {
      try 
      {
        const x = this.x_area;
        const y = this.y_area;
  
        const positions = [];

        for (let i = 0; i < x; i++)
        {
          for (let j = 0; j < y; j++) 
          {
            const position = {
              x: i,
              y: j,
              map_id: this.id,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            positions.push(position);
          }
        }

        const Map_position = sequelize.models.Map_position;
        await Map_position.bulkCreate(positions);
      }
      catch (error)
      {
        throw error;
      }
    }
  }

  Map.init({
    server_name: {
      type: DataTypes.STRING,
      allowNull: false,
      reference: {
        model: 'serveur',
        key: 'name'
      }
    },
    x_area: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    y_area: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Map',
    tableName: 'map',
    indexes: [
      {
        unique: true,
        fields: ['server_name']
      }
    ]
  });

  Map.afterCreate(async (map, options) => {
    try 
    {
      await map.generateMapPositions();
    }
    catch (error)
    {
      throw error;
    }
  });
  
  return Map;
};