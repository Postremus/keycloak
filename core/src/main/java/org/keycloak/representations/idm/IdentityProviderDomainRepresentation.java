/*
 * Copyright 2024 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.keycloak.representations.idm;

/**
 * Representation implementation of an identity provider internet domain.
 *
 * @author <a href="mailto:martin.panzer@active-logistics.com">Martin Panzer</a>
 */
public class IdentityProviderDomainRepresentation {

    private String name;

    public IdentityProviderDomainRepresentation() {
        // for reflection
    }

    public IdentityProviderDomainRepresentation(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (!(o instanceof IdentityProviderDomainRepresentation)) return false;

        IdentityProviderDomainRepresentation that = (IdentityProviderDomainRepresentation) o;
        return name != null && name.equals(that.getName());
    }

    @Override
    public int hashCode() {
        if (name == null) {
            return super.hashCode();
        }
        return name.hashCode();
    }
}
