import React, {FunctionComponent} from 'react';
import {Formik, FormikHelpers} from 'formik';
import {setsValidation} from './SetsHelpers';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FormikField from '../Formik/FormikField';
// @ts-ignore
import {Form} from 'react-formik-ui';
import {Button, ButtonGroup} from 'reactstrap';
import {ISetBasicModel} from '../../models/ISetModel';
import i18next from 'i18next';
import {SetTypesEnum} from '../../enums/SetTypesEnum';

const SetsTableRowFormRender: FunctionComponent<ISetsTableRowFormRender> = ({initialData, onSubmit, t, setAddSetViewVisible, setTypeShown}) => {
  return (
    <Formik
      initialValues={initialData}
      onSubmit={onSubmit}
      validate={(values: any) => {
        return setsValidation(values, t);
      }}
      render={({errors, isSubmitting}) => (
        <>
          {isSubmitting && <tr><td colSpan={3} className="text-center"><FontAwesomeIcon icon="spinner" spin/></td></tr>}
          {!isSubmitting && <>
            <tr>
              <th className="align-middle" scope="row">{initialData.index}</th>
              <td>
                <FormikField name="amountInKg" labelText={t("Amount in KG")} type="number" labelHidden inputProps={{min: 0, autoFocus: true}}/>
              </td>
              {setTypeShown === SetTypesEnum.SET_TYPE_REPS && <td>
                <FormikField name="reps" labelText={t("Repetitions")} type="number" labelHidden inputProps={{min: 0}}/>
              </td>}
              {setTypeShown === SetTypesEnum.SET_TYPE_SECONDS && <td>
                <FormikField name="seconds" labelText={t("Seconds")} type="number" labelHidden inputProps={{min: 0}}/>
              </td>}
            </tr>
            <tr>
              <td colSpan={3}>
                <Form mode='structured'>
                  <ButtonGroup className="w-100">
                    <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save set")}</Button>
                    <Button color="danger" onClick={() => setAddSetViewVisible(false)}>{t("Discard set")}</Button>
                  </ButtonGroup>
                </Form>
              </td>
            </tr>
          </>}
        </>
      )}
    />
  );
};

interface ISetsTableRowFormRender {
  initialData: ISetBasicModel,
  onSubmit: ((values: ISetBasicModel, actions: FormikHelpers<ISetBasicModel>) => void),
  t: i18next.TFunction,
  setAddSetViewVisible: ((visible: boolean) => void),
  setTypeShown: SetTypesEnum
}

export default SetsTableRowFormRender;
