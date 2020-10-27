import React, {FunctionComponent} from 'react';
import {Form, Formik, FormikHelpers} from 'formik';
import {ISetModel} from '../../models/ISetModel';
import FormikField from '../Formik/FormikField';
import {useTranslation} from 'react-i18next';
import {Button, ButtonGroup, Col, Row} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {setsValidation} from './SetsHelpers';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';

const SetForm: FunctionComponent<ISetFormProps> = ({hideFormCb, exerciseType, currentData, onSubmit, extraButtonGroups}) => {
  const { t } = useTranslation();

  return <Formik
    initialValues={currentData}
    onSubmit={onSubmit}
    validate={(values: any) => {
      return setsValidation(values, t);
    }}>
    {({errors, isSubmitting}) => (
      <>
        {isSubmitting && <Row><Col className="text-center py-2"><FontAwesomeIcon icon="spinner" spin/></Col></Row>}
        {!isSubmitting && <Form>
          <Row>
            <Col xs={2} className="py-2"><strong>{currentData.index}</strong></Col>
            <Col xs={5} className="px-1">
              <FormikField name="amountInKg" labelText={t('Amount in KG')} type="number" labelHidden
                           inputProps={{min: 0, autoFocus: true, step: '0.25'}}/>
            </Col>
            {exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS &&
            <Col xs={5} className="px-1"><FormikField name="reps" labelText={t('Repetitions')} type="number" labelHidden
                                     inputProps={{min: 0, step: '1'}} addedClassNames="p-2"/></Col>}
            {exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS &&
            <Col xs={5} className="px-1"><FormikField name="seconds" labelText={t('Seconds')} type="number" labelHidden
                                     inputProps={{min: 0, step: '1'}} addedClassNames="p-2"/></Col>}
          </Row>
          <Row>
            <ButtonGroup className="w-100" vertical>
              <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t('Save set')}</Button>
              <Button color="danger" onClick={() => hideFormCb()}>{t('Discard set')}</Button>
              {extraButtonGroups}
            </ButtonGroup>
          </Row>
        </Form>}
      </>
    )}
  </Formik>;
};

interface ISetFormProps {
  hideFormCb: (() => void)
  exerciseType: ExerciseTypesEnum
  currentData: ISetModel
  onSubmit: ((values: ISetModel, actions: FormikHelpers<ISetModel>) => void)
  extraButtonGroups?: any
}

export default SetForm;
