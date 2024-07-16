enum Actions {
  FindAll = 'findAll',
  FindOne = 'findOne',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  ChangeOrderStatus = 'changeOrderStatus',
}

export const getActionName = (entityName: string) => {
  return {
    findAll: `${entityName}_${Actions.FindAll}`,
    findOne: `${entityName}_${Actions.FindOne}`,
    create: `${entityName}_${Actions.Create}`,
    update: `${entityName}_${Actions.Update}`,
    delete: `${entityName}_${Actions.Delete}`,
    changeOrderStatus: `${entityName}_${Actions.ChangeOrderStatus}`,
  };
};
