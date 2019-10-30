import React, {FunctionComponent} from 'react';
import {Formik, FormikHelpers} from 'formik';
import {setsValidation} from '../SetsHelpers';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FormikField from '../../Formik/FormikField';
import {Button, ButtonGroup} from 'reactstrap';
// @ts-ignore
import {Form} from 'react-formik-ui';
import {ISetSecondsBasicModel, ISetSecondsModel} from '../../../models/ISetSecondsModel';
import * as i18next from 'i18next';

const SetsSecondsTableFormRowRender: FunctionComponent<ISetsSecondsTableFormRowRender> = ({initialData, onSubmit, t, setAddSetViewVisible}) => {
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
              <td>
                <FormikField name="seconds" labelText={t("Seconds")} type="number" labelHidden inputProps={{min: 0}}/>
              </td>
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

interface ISetsSecondsTableFormRowRender {
  initialData: ISetSecondsModel | ISetSecondsBasicModel,
  onSubmit: ((values: ISetSecondsModel | ISetSecondsBasicModel, actions: FormikHelpers<ISetSecondsModel | ISetSecondsBasicModel>) => void),
  t: i18next.TFunction,
  setAddSetViewVisible: ((visible: boolean) => void),
}

export default SetsSecondsTableFormRowRender;