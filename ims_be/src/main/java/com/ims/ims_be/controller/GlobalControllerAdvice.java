    package com.ims.ims_be.controller;

    import org.springframework.web.bind.WebDataBinder;
    import org.springframework.web.bind.annotation.InitBinder;
    import org.springframework.web.bind.annotation.RestControllerAdvice;

    import java.beans.PropertyEditorSupport;

    @RestControllerAdvice
    class GlobalControllerAdvice {

        @InitBinder
        public void initBinder(WebDataBinder binder) {
            binder.registerCustomEditor(Integer.class, "page", new IntegerEditor(0));
            binder.registerCustomEditor(Integer.class, "size", new IntegerEditor(10));
        }

        static class IntegerEditor extends PropertyEditorSupport {
            private final int defaultValue;

            public IntegerEditor(int defaultValue) {
                this.defaultValue = defaultValue;
            }

            @Override
            public void setAsText(String text) {
                try {
                    setValue(Integer.parseInt(text));
                } catch (NumberFormatException e) {
                    setValue(defaultValue);
                }
            }
        }
    }